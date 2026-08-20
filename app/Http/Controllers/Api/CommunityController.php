<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\CommunityJoinRequest;
use App\Models\CommunityMember;
use App\Models\CommunityRole;
use App\Models\Instrument;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CommunityController extends Controller
{
    /**
     * List/cari komunitas, bisa difilter by kategori atau instrument.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Community::query()
            ->where('status', 'Active')
            ->with(['category', 'owner']);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        if ($request->filled('search')) {
            $query->where('community_name', 'like', '%' . $request->string('search') . '%');
        }

        return response()->json($query->orderByDesc('total_member')->paginate(12));
    }

    public function show(Community $community): JsonResponse
    {
        return response()->json(
            $community->load([
                'category',
                'owner',
                'mainQuests' => fn ($q) => $q->orderBy('level'),
                'dailyMissions' => fn ($q) => $q->where('status', 'Active'),
                'challenges' => fn ($q) => $q->where('status', 'Active'),
            ])
        );
    }

    /**
     * Buat komunitas baru. Hanya user dengan level->can_create_community = true.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user()->load('level');

        if (! $user->level || ! $user->level->can_create_community) {
            throw ValidationException::withMessages([
                'level' => ['Kamu belum bisa membuat komunitas. Naikkan level dulu.'],
            ]);
        }

        $data = $request->validate([
            // instrument_id opsional supaya endpoint ini tetap backward-compatible
            // (mis. dipanggil tanpa instrument, seperti CommunityFactory di test),
            // tapi kalau diisi, category_id ikut diturunkan dari instrument-nya
            // supaya komunitas baru tetap muncul saat user browsing per-instrument
            // (lihat CommunityWebController::index, yang default filter by instrument_id).
            'instrument_id' => ['nullable', 'exists:instruments,intruments_id'],
            'category_id' => ['required_without:instrument_id', 'nullable', 'exists:music_categories,music_categories_id'],
            'community_name' => ['required', 'string', 'max:150'],
            'logo' => ['nullable', 'string', 'max:255'],
            'banner' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        if (! empty($data['instrument_id'])) {
            $data['category_id'] = Instrument::findOrFail($data['instrument_id'])->category_id;
        }

        $community = Community::create([
            ...$data,
            'owner_id' => $user->users_id,
            'total_member' => 1,
            'status' => 'Active',
        ]);

        $ketuaRole = CommunityRole::firstOrCreate(
            ['role_name' => 'Ketua'],
            ['description' => 'Pemilik & pengelola utama komunitas']
        );

        $community->members()->create([
            'user_id' => $user->users_id,
            'role_id' => $ketuaRole->community_roles_id,
            'join_date' => now(),
            'status' => 'Active',
        ]);

        return response()->json($community->load('members'), 201);
    }

    /**
     * Ajukan permintaan bergabung ke komunitas (butuh approval Ketua/Wakil Ketua).
     */
    public function join(Request $request, Community $community): JsonResponse
    {
        $user = $request->user();

        $existing = CommunityJoinRequest::where('community_id', $community->communities_id)
            ->where('user_id', $user->users_id)
            ->whereIn('status', ['Pending', 'Active'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Kamu sudah pernah mengajukan/menjadi member.'], 409);
        }

        $memberRole = CommunityRole::firstOrCreate(
            ['role_name' => 'Member'],
            ['description' => 'Anggota komunitas']
        );

        $joinRequest = CommunityJoinRequest::create([
            'community_id' => $community->communities_id,
            'user_id' => $user->users_id,
            'role_id' => $memberRole->community_roles_id,
            'join_date' => now(),
            'status' => 'Pending',
        ]);

        return response()->json($joinRequest, 201);
    }

    /**
     * Daftar join request pending (khusus Ketua/Wakil Ketua).
     */
    public function joinRequests(Request $request, Community $community): JsonResponse
    {
        $this->authorize('manage', $community);

        return response()->json(
            $community->joinRequests()->where('status', 'Pending')->with('user')->get()
        );
    }

    public function approveJoinRequest(Request $request, Community $community, CommunityJoinRequest $joinRequest): JsonResponse
    {
        $this->authorize('manage', $community);

        $joinRequest->update(['status' => 'Active']);

        $community->members()->create([
            'user_id' => $joinRequest->user_id,
            'role_id' => $joinRequest->role_id,
            'join_date' => now(),
            'status' => 'Active',
        ]);

        $community->increment('total_member');

        return response()->json(['message' => 'Permintaan bergabung disetujui.']);
    }

    public function rejectJoinRequest(Request $request, Community $community, CommunityJoinRequest $joinRequest): JsonResponse
    {
        $this->authorize('manage', $community);

        $joinRequest->update(['status' => 'Removed']);

        Notification::create([
            'user_id' => $joinRequest->user_id,
            'title' => 'Permintaan bergabung ditolak',
            'message' => "Permintaan kamu untuk bergabung ke komunitas \"{$community->community_name}\" ditolak oleh pengelola.",
            'type' => 'System',
            'reference_type' => Community::class,
            'reference_id' => $community->communities_id,
        ]);

        return response()->json(['message' => 'Permintaan bergabung ditolak.']);
    }

    /**
     * Keluar dari komunitas. Ketua tidak boleh keluar begitu saja selama
     * masih ada member lain — harus transfer kepemimpinan dulu lewat
     * updateMemberRole(), supaya komunitas tidak kehilangan pengelola.
     */
    public function leave(Request $request, Community $community): JsonResponse
    {
        $user = $request->user();

        $membership = $community->members()
            ->where('user_id', $user->users_id)
            ->where('status', 'Active')
            ->with('role')
            ->first();

        if (! $membership) {
            return response()->json(['message' => 'Kamu bukan member komunitas ini.'], 404);
        }

        $isKetua = $membership->role?->role_name === 'Ketua';
        $otherActiveMembers = $community->members()->where('status', 'Active')
            ->where('community_members_id', '!=', $membership->community_members_id)
            ->exists();

        if ($isKetua && $otherActiveMembers) {
            throw ValidationException::withMessages([
                'role' => ['Sebagai Ketua, kamu harus menunjuk Ketua baru dulu sebelum keluar komunitas.'],
            ]);
        }

        $membership->update(['status' => 'Removed']);
        $community->decrement('total_member');

        if ($isKetua && ! $otherActiveMembers) {
            $community->update(['status' => 'Inactive']);
        }

        return response()->json(['message' => 'Kamu telah keluar dari komunitas.']);
    }

    /**
     * Ubah role member (mis. jadikan Wakil Ketua/Staff, atau transfer
     * kepemimpinan). Hanya Ketua/Wakil Ketua yang boleh mengelola.
     */
    public function updateMemberRole(Request $request, Community $community, CommunityMember $member): JsonResponse
    {
        $this->authorize('manage', $community);

        abort_unless($member->community_id === $community->communities_id, 404);

        $data = $request->validate([
            'role_name' => ['required', 'string', 'in:Wakil Ketua,Staff,Member,Ketua'],
        ]);

        $role = CommunityRole::firstOrCreate(['role_name' => $data['role_name']]);

        if ($data['role_name'] === 'Ketua') {
            // Transfer kepemimpinan: Ketua lama otomatis jadi Wakil Ketua.
            $currentKetua = $community->members()
                ->where('status', 'Active')
                ->whereHas('role', fn ($q) => $q->where('role_name', 'Ketua'))
                ->first();

            if ($currentKetua && $currentKetua->community_members_id !== $member->community_members_id) {
                $wakilRole = CommunityRole::firstOrCreate(['role_name' => 'Wakil Ketua']);
                $currentKetua->update(['role_id' => $wakilRole->community_roles_id]);
            }

            $community->update(['owner_id' => $member->user_id]);
        }

        $member->update(['role_id' => $role->community_roles_id]);

        return response()->json($member->load('role', 'user'));
    }

    /**
     * Keluarkan member dari komunitas (bukan menghapus akun user).
     */
    public function removeMember(Request $request, Community $community, CommunityMember $member): JsonResponse
    {
        $this->authorize('manage', $community);

        abort_unless($member->community_id === $community->communities_id, 404);

        if ($member->role?->role_name === 'Ketua') {
            throw ValidationException::withMessages([
                'role' => ['Ketua tidak bisa dikeluarkan. Transfer kepemimpinan dulu.'],
            ]);
        }

        $member->update(['status' => 'Removed']);
        $community->decrement('total_member');

        Notification::create([
            'user_id' => $member->user_id,
            'title' => 'Dikeluarkan dari komunitas',
            'message' => "Kamu dikeluarkan dari komunitas \"{$community->community_name}\" oleh pengelola.",
            'type' => 'System',
            'reference_type' => Community::class,
            'reference_id' => $community->communities_id,
        ]);

        return response()->json(['message' => 'Member dikeluarkan dari komunitas.']);
    }
}
