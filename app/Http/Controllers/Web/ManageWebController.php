<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Concerns\ResolvesActiveCommunity;
use App\Http\Controllers\Controller;
use App\Models\ChallengeSubmission;
use App\Models\Instrument;
use App\Models\PracticeSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Halaman-halaman ini hanya me-render form/tampilan Inertia. Aksi submit-nya
 * langsung memanggil endpoint yang sudah ada di routes/api.php lewat fetch
 * dari React (lihat resources/js/lib/api.ts), supaya logika create/approve/
 * review tidak terduplikasi antara Web dan Api controller.
 */
class ManageWebController extends Controller
{
    use ResolvesActiveCommunity;

    public function members(Request $request): Response|RedirectResponse
    {
        $membership = $this->requireManagingMembership($request);
        if ($membership instanceof RedirectResponse) {
            return $membership;
        }

        $community = $membership->community;

        return Inertia::render('Manage/Members', [
            'community' => $community,
            'members' => $community->members()
                ->with(['user', 'role'])
                ->where('status', 'Active')
                ->orderBy('join_date')
                ->get(),
        ]);
    }

    public function mainQuestCreate(Request $request): Response|RedirectResponse
    {
        $membership = $this->requireManagingMembership($request, mustManage: true);
        if ($membership instanceof RedirectResponse) {
            return $membership;
        }

        return Inertia::render('Manage/MainQuestCreate', [
            'community' => $membership->community,
            'existingLevels' => $membership->community->mainQuests()->pluck('level'),
        ]);
    }

    public function dailyMissionCreate(Request $request): Response|RedirectResponse
    {
        $membership = $this->requireManagingMembership($request, mustManage: true);
        if ($membership instanceof RedirectResponse) {
            return $membership;
        }

        return Inertia::render('Manage/DailyMissionCreate', [
            'community' => $membership->community,
            'activeCount' => $membership->community->dailyMissions()->where('status', 'Active')->count(),
        ]);
    }

    public function challengeCreate(Request $request): Response|RedirectResponse
    {
        $membership = $this->requireManagingMembership($request, mustManage: true);
        if ($membership instanceof RedirectResponse) {
            return $membership;
        }

        return Inertia::render('Manage/ChallengeCreate', [
            'community' => $membership->community,
            'instruments' => Instrument::orderBy('name')->get(),
            'hasActiveChallenge' => $membership->community->challenges()->where('status', 'Active')->exists(),
        ]);
    }

    public function reviews(Request $request): Response|RedirectResponse
    {
        $membership = $this->requireManagingMembership($request);
        if ($membership instanceof RedirectResponse) {
            return $membership;
        }

        $community = $membership->community;

        $practiceSubmissions = PracticeSubmission::with('user', 'practice')
            ->whereHas('practice.material.mainQuest', fn ($q) => $q->where('community_id', $community->communities_id))
            ->where('status', 'Pending')
            ->latest('submitted_at')
            ->get();

        $challengeSubmissions = ChallengeSubmission::with('user', 'challenge')
            ->whereHas('challenge', fn ($q) => $q->where('community_id', $community->communities_id))
            ->where('status', 'Pending')
            ->latest('submitted_at')
            ->get();

        return Inertia::render('Manage/Reviews', [
            'community' => $community,
            'practiceSubmissions' => $practiceSubmissions,
            'challengeSubmissions' => $challengeSubmissions,
        ]);
    }

    public function materialCreate(Request $request, \App\Models\MainQuest $mainQuest): Response
    {
        $mainQuest->loadMissing('community');
        $this->authorize('manage', $mainQuest->community);

        return Inertia::render('Manage/MaterialCreate', [
            'mainQuest' => $mainQuest,
            'instruments' => Instrument::orderBy('name')->get(),
        ]);
    }

    public function quizCreate(Request $request, \App\Models\Material $material): Response
    {
        $material->loadMissing('mainQuest.community');
        $this->authorize('manage', $material->mainQuest->community);

        return Inertia::render('Manage/QuizCreate', [
            'material' => $material,
        ]);
    }

    public function practiceCreate(Request $request, \App\Models\Material $material): Response
    {
        $material->loadMissing('mainQuest.community');
        $this->authorize('manage', $material->mainQuest->community);

        return Inertia::render('Manage/PracticeCreate', [
            'material' => $material,
        ]);
    }

    public function reviewPractice(Request $request, PracticeSubmission $submission): Response
    {
        $submission->load(['user', 'practice.material.mainQuest.community']);
        $this->authorize('review', $submission->practice->material->mainQuest->community);

        return Inertia::render('Manage/ReviewPractice', [
            'submission' => $submission,
        ]);
    }

    public function reviewChallenge(Request $request, ChallengeSubmission $submission): Response
    {
        $submission->load(['user', 'challenge.community']);
        $this->authorize('review', $submission->challenge->community);

        return Inertia::render('Manage/ReviewChallenge', [
            'submission' => $submission,
        ]);
    }

    /**
     * Pastikan user sedang aktif di sebuah komunitas dan (opsional) berhak
     * membuat konten (Ketua/Wakil Ketua), bukan cuma me-review.
     */
    protected function requireManagingMembership(Request $request, bool $mustManage = false): mixed
    {
        $user = $request->user();
        $membership = $this->activeMembership($user);

        if (! $membership) {
            return redirect()->route('dashboard')->with('error', 'Kamu belum tergabung di komunitas manapun.');
        }

        $community = $membership->community;
        $ability = $mustManage ? 'manage' : 'review';

        if (! $request->user()->can($ability, $community)) {
            abort(403, 'Kamu tidak punya akses ke halaman ini.');
        }

        return $membership;
    }
}
