<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Concerns\ResolvesActiveCommunity;
use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\CommunityJoinRequest;
use App\Models\CommunityRole;
use App\Models\MusicCategory;
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
        if (! $request->user()->instrument_id) {
            return redirect()->route('onboarding.category');
        }

        $query = Community::query()
            ->where('status', 'Active')
            ->with(['category', 'owner']);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        if ($request->filled('search')) {
            $query->where('community_name', 'like', '%'.$request->string('search').'%');
        }

        return Inertia::render('Communities/Index', [
            'communities' => $query->orderByDesc('total_member')->paginate(12)->withQueryString(),
            'categories' => MusicCategory::orderBy('name')->get(),
            'filters' => $request->only('search', 'category_id'),
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

        $membership = $community->members()->where('user_id', $user->users_id)->first();
        $pendingRequest = CommunityJoinRequest::where('community_id', $community->communities_id)
            ->where('user_id', $user->users_id)
            ->where('status', 'Pending')
            ->first();

        return Inertia::render('Communities/Show', [
            'community' => $community,
            'membershipStatus' => $membership?->status ?? ($pendingRequest ? 'Pending' : null),
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
}
