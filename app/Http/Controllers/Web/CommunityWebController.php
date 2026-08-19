<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Concerns\ResolvesActiveCommunity;
use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\CommunityJoinRequest;
use App\Models\CommunityRole;
use App\Models\Instrument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunityWebController extends Controller
{
    use ResolvesActiveCommunity;

    /**
     * Cari komunitas (search + filter kategori), mirror App\Http\Controllers\Api\CommunityController::index.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
    
        if (! $user->instrument_id) {
            return redirect()->route('onboarding.category');
        }
    
        // Default: instrument yang dipilih user saat onboarding.
        // User tetap bisa ganti lewat query param instrument_id kalau mau lihat komunitas lain.
        $instrumentId = $request->filled('instrument_id')
            ? $request->integer('instrument_id')
            : $user->instrument_id;
    
        $query = Community::query()
            ->where('status', 'Active')
            ->with(['category', 'owner', 'instrument']);
    
        if ($instrumentId) {
            $query->where('instrument_id', $instrumentId);
        }
    
        if ($request->filled('search')) {
            $query->where('community_name', 'like', '%'.$request->string('search').'%');
        }
    
        return Inertia::render('Communities/Index', [
            'communities' => $query->orderByDesc('total_member')->paginate(12)->withQueryString(),
            'instruments' => Instrument::orderBy('name')->get(['intruments_id', 'name', 'category_id']),
            'filters' => [
                'search' => $request->input('search'),
                'instrument_id' => (string) $instrumentId,
            ],
            'currentInstrument' => $user->instrument()->select('intruments_id', 'name')->first(),
        ]);
    }

    public function show(Request $request, Community $community): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user->instrument_id) {
            return redirect()->route('onboarding.category');
        }

        $community->load([
            'category',
            'owner',
            'mainQuests' => fn ($q) => $q->orderBy('level'),
            'dailyMissions' => fn ($q) => $q->where('status', 'Active'),
            'challenges' => fn ($q) => $q->where('status', 'Active'),
        ]);

        $membership = $community->members()->where('user_id', $user->users_id)->with('role')->first();
        $pendingRequest = CommunityJoinRequest::where('community_id', $community->communities_id)
            ->where('user_id', $user->users_id)
            ->where('status', 'Pending')
            ->first();

        return Inertia::render('Communities/Show', [
            'community' => $community,
            'membershipStatus' => $membership?->status ?? ($pendingRequest ? 'Pending' : null),
            'membershipRole' => $membership?->role?->role_name,
        ]);
    }

    public function join(Request $request, Community $community): RedirectResponse
    {
        $user = $request->user();

        $existing = CommunityJoinRequest::where('community_id', $community->communities_id)
            ->where('user_id', $user->users_id)
            ->whereIn('status', ['Pending', 'Active'])
            ->first();

        if ($existing) {
            return back()->with('error', 'Kamu sudah pernah mengajukan/menjadi member komunitas ini.');
        }

        $memberRole = CommunityRole::firstOrCreate(
            ['role_name' => 'Member'],
            ['description' => 'Anggota komunitas']
        );

        CommunityJoinRequest::create([
            'community_id' => $community->communities_id,
            'user_id' => $user->users_id,
            'role_id' => $memberRole->community_roles_id,
            'join_date' => now(),
            'status' => 'Pending',
        ]);

        return back()->with('success', 'Permintaan bergabung terkirim, menunggu persetujuan Ketua/Wakil Ketua.');
    }

    public function leave(Request $request, Community $community): RedirectResponse
    {
        $user = $request->user();

        $membership = $community->members()
            ->where('user_id', $user->users_id)
            ->where('status', 'Active')
            ->with('role')
            ->first();

        if (! $membership) {
            return back()->with('error', 'Kamu bukan member komunitas ini.');
        }

        $isKetua = $membership->role?->role_name === 'Ketua';
        $otherActiveMembers = $community->members()->where('status', 'Active')
            ->where('community_members_id', '!=', $membership->community_members_id)
            ->exists();

        if ($isKetua && $otherActiveMembers) {
            return back()->with('error', 'Sebagai Ketua, kamu harus menunjuk Ketua baru dulu sebelum keluar komunitas.');
        }

        $community->members()
            ->where('community_members_id', $membership->community_members_id)
            ->update(['status' => 'Removed']);
        $community->decrement('total_member');

        if ($isKetua && ! $otherActiveMembers) {
            $community->update(['status' => 'Inactive']);
        }

        return redirect()
        ->route('communities.index')
        ->with('info', 'Kamu sudah keluar dari komunitas. Ingin ganti alat musik? Klik "Ganti instrument" di atas.');
    }
}
