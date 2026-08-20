<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\Community;
use App\Models\CommunityJoinRequest;
use App\Models\CommunityMember;
use App\Models\ChallengeSubmission;
use App\Models\MainQuest;
use App\Models\PracticeSubmission;
use App\Models\UserDailyMission;
use Illuminate\Http\RedirectResponse;
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
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user()->load('role', 'level', 'instrument');

        if ($user->role?->role_name === 'Admin') {
            return $this->renderAdmin();
        }

        if (! $user->instrument_id) {
            return redirect()->route('onboarding.category');
        }

        $membership = CommunityMember::with(['community', 'role'])
            ->where('user_id', $user->users_id)
            ->where('status', 'Active')
            ->latest('join_date')
            ->first();

        if (! $membership) {
            return Inertia::render('Dashboard/Member', [
                'user' => $user,
                'community' => null,
            ]);
        }

        $community = $membership->community;

        $communityRoleName = $membership->role->role_name;

        return match ($communityRoleName) {
            'Ketua' => $this->renderLeader($membership),
            'Wakil Ketua' => $this->renderViceLeader($membership),
            'Staff' => $this->renderStaff($membership),
            default => $this->renderMember($user, $community),
        };
    }

    /**
     * Dashboard Member biasa — sebelumnya hanya mengirim 'user' & 'community'
     * sehingga Dashboard/Member.tsx selalu jatuh ke default props hardcoded
     * (level, mainQuests, dailyMissions, challenge, recentPosts palsu) dan
     * XP/level user yang sebenarnya tidak pernah terlihat berubah di UI
     * walaupun sudah naik lewat GamificationService::addXp(). Sekarang semua
     * data live dikirim, mirror logika di MainQuestWebController,
     * DailyMissionWebController, ChallengeWebController, dan ForumWebController
     * supaya konsisten dengan halaman detail masing-masing modul.
     */
    protected function renderMember($user, Community $community): Response
    {
        $communityData = [
            'communities_id' => $community->communities_id,
            'community_name' => $community->community_name,
            'status' => $community->status,
            'is_active' => $community->status === 'Active',
            'total_member' => (int) $community->total_member,
        ];

        $mainQuests = $community->mainQuests()
            ->with(['materials.progress' => fn ($q) => $q->where('user_id', $user->users_id)])
            ->orderBy('level')
            ->get()
            ->map(function (MainQuest $quest) {
                $quest->setAttribute('is_completed', $this->isQuestCompleted($quest));

                return $quest;
            });

        $today = now()->toDateString();

        $dailyMissions = $community->dailyMissions()
            ->where('status', 'Active')
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->orderBy('mission_number')
            ->get()
            ->map(function ($mission) use ($user, $today) {
                $mission->setRelation(
                    'my_progress',
                    UserDailyMission::where('mission_id', $mission->daily_missions_id)
                        ->where('user_id', $user->users_id)
                        ->whereDate('mission_date', $today)
                        ->first()
                );

                return $mission;
            });

        $challenge = $community->challenges()
            ->where('status', 'Active')
            ->first();

        $recentPosts = $community->forumPosts()
            ->where('status', 'Published')
            ->with('user')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard/Member', [
            'user' => $user,
            'level' => $user->level,
            'community' => $communityData,
            'mainQuests' => $mainQuests,
            'dailyMissions' => $dailyMissions,
            'challenge' => $challenge,
            'recentPosts' => $recentPosts,
        ]);
    }

    protected function renderAdmin(): Response
    {
        return Inertia::render('Dashboard/Admin', [
            'stats' => [
                'total_users' => \App\Models\User::count(),
                'total_communities' => Community::count(),
                'total_active_challenges' => Challenge::where('status', 'Active')->count(),
                'reported_content' => 0,
            ],
            'recentCommunities' => Community::with('category')
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
            'community' => [
                'communities_id' => $community->communities_id,
                'community_name' => $community->community_name,
                'status' => $community->status,
                'total_member' => (int) $community->total_member,
],
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
            'community' => [
                'communities_id' => $community->communities_id,
                'community_name' => $community->community_name,
                'status' => $community->status,
                'total_member' => (int) $community->total_member,
],
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
            'community' => [
                'communities_id' => $community->communities_id,
                'community_name' => $community->community_name,
                'status' => $community->status,
                'total_member' => (int) $community->total_member,
],
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
        $practiceSubmissions = PracticeSubmission::with('user', 'practice')
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

        $challengeSubmissions = ChallengeSubmission::with('user', 'challenge')
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

    /**
     * Sama seperti MainQuestWebController::isQuestCompleted — sebuah Main
     * Quest dianggap selesai kalau semua materinya sudah 'Completed' untuk
     * user ini.
     */
    protected function isQuestCompleted(MainQuest $quest): bool
    {
        if ($quest->materials->isEmpty()) {
            return false;
        }

        return $quest->materials->every(function ($material) {
            $progress = $material->progress->first();

            return $progress && $progress->status === 'Completed';
        });
    }
}