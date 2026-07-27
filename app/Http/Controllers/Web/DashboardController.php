<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\CommunityJoinRequest;
use App\Models\CommunityMember;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Satu pintu masuk "/dashboard" yang dialihkan ke halaman React yang sesuai:
 * Admin, Ketua, Wakil Ketua, Staff, atau Member biasa — tergantung role
 * global user dan role-nya di komunitas aktif.
 */
class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->load('role', 'level', 'instrument');

        if ($user->role?->role_name === 'Admin') {
            return $this->renderAdmin();
        }

        // Ambil keanggotaan komunitas Active pertama sebagai "komunitas aktif".
        // Catatan: untuk MVP diasumsikan 1 user aktif di 1 komunitas utama.
        $membership = CommunityMember::with(['community', 'role'])
            ->where('user_id', $user->users_id)
            ->where('status', 'Active')
            ->latest('join_date')
            ->first();

        if (! $membership) {
            // Belum gabung komunitas manapun. Untuk saat ini tampilkan
            // dashboard Member dengan community kosong; halaman "cari
            // komunitas" akan dibuat terpisah (lihat catatan di routes/web.php).
            return Inertia::render('Dashboard/Member', [
                'user' => $user,
                'community' => null,
            ]);
        }

        // Catatan: untuk role Member, data mainQuests/dailyMissions/challenge/
        // recentPosts idealnya diisi dari MainQuestController/DailyMissionController/
        // dst (lihat app/Http/Controllers/Api/*). Belum disambungkan di sini
        // agar controller ini tetap ringkas — Dashboard/Member.jsx sudah punya
        // nilai default sehingga tetap tampil sementara data itu belum dikirim.

        $communityRoleName = $membership->role->role_name;

        return match ($communityRoleName) {
            'Ketua' => $this->renderLeader($membership),
            'Wakil Ketua' => $this->renderViceLeader($membership),
            'Staff' => $this->renderStaff($membership),
            default => Inertia::render('Dashboard/Member', [
                'user' => $user,
                'community' => $membership->community,
            ]),
        };
    }

    protected function renderAdmin(): Response
    {
        return Inertia::render('Dashboard/Admin', [
            'stats' => [
                'total_users' => \App\Models\User::count(),
                'total_communities' => \App\Models\Community::count(),
                'total_active_challenges' => \App\Models\Challenge::where('status', 'Active')->count(),
                'reported_content' => 0,
            ],
            'recentCommunities' => \App\Models\Community::with('category')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn ($c) => [
                    'communities_id' => $c->communities_id,
                    'community_name' => $c->community_name,
                    'category' => $c->category?->name,
                    'total_member' => (int) $c->total_member,
                ]),
        ]);
    }

    protected function renderLeader(CommunityMember $membership): Response
    {
        $community = $membership->community;

        return Inertia::render('Dashboard/CommunityLeader', [
            'community' => $community,
            'joinRequests' => CommunityJoinRequest::with('user')
                ->where('community_id', $community->communities_id)
                ->where('status', 'Pending')
                ->get(),
            'pendingSubmissions' => $this->pendingSubmissions($community->communities_id),
        ]);
    }

    protected function renderViceLeader(CommunityMember $membership): Response
    {
        $community = $membership->community;

        return Inertia::render('Dashboard/ViceLeader', [
            'community' => $community,
            'joinRequests' => CommunityJoinRequest::with('user')
                ->where('community_id', $community->communities_id)
                ->where('status', 'Pending')
                ->get(),
            'pendingSubmissions' => $this->pendingSubmissions($community->communities_id),
        ]);
    }

    protected function renderStaff(CommunityMember $membership): Response
    {
        $community = $membership->community;

        return Inertia::render('Dashboard/CommunityStaff', [
            'community' => $community,
            'joinRequests' => CommunityJoinRequest::with('user')
                ->where('community_id', $community->communities_id)
                ->where('status', 'Pending')
                ->get(),
            'pendingSubmissions' => $this->pendingSubmissions($community->communities_id),
        ]);
    }

    /**
     * Gabungan submission practice + challenge yang masih Pending di komunitas ini.
     */
    protected function pendingSubmissions(int $communityId): array
    {
        $practiceSubmissions = \App\Models\PracticeSubmission::with('user', 'practice')
            ->whereHas('practice.material.mainQuest', fn ($q) => $q->where('community_id', $communityId))
            ->where('status', 'Pending')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->practice_submissions_id,
                'title' => $s->practice->title,
                'user' => ['name' => $s->user->name],
                'type' => 'Practice',
                'reviewUrl' => "/manage/practice-submissions/{$s->practice_submissions_id}",
            ]);

        $challengeSubmissions = \App\Models\ChallengeSubmission::with('user', 'challenge')
            ->whereHas('challenge', fn ($q) => $q->where('community_id', $communityId))
            ->where('status', 'Pending')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->challenge_submissions_id,
                'title' => $s->challenge->title,
                'user' => ['name' => $s->user->name],
                'type' => 'Challenge',
                'reviewUrl' => "/manage/challenge-submissions/{$s->challenge_submissions_id}",
            ]);

        return $practiceSubmissions->concat($challengeSubmissions)->values()->all();
    }
}
