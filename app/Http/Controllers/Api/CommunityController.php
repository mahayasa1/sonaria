<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\CommunityJoinRequest;
use App\Models\CommunityRole;
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
            'category_id' => ['required', 'exists:music_categories,music_categories_id'],
            'community_name' => ['required', 'string', 'max:150'],
            'logo' => ['nullable', 'string', 'max:255'],
            'banner' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

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

        return response()->json(['message' => 'Permintaan bergabung ditolak.']);
    }
}
