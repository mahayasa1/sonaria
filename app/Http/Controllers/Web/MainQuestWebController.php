<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Concerns\ResolvesActiveCommunity;
use App\Http\Controllers\Controller;
use App\Models\MainQuest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MainQuestWebController extends Controller
{
    use ResolvesActiveCommunity;

    /**
     * 7 level main quest komunitas aktif user, mirror
     * App\Http\Controllers\Api\MainQuestController::index (+ is_completed).
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $membership = $this->activeMembership($user);

        if (! $membership) {
            return redirect()->route('communities.index')
                ->with('error', 'Gabung ke sebuah komunitas dulu untuk melihat Main Quest.');
        }

        $community = $membership->community;

        $quests = $community->mainQuests()
            ->with(['materials.progress' => fn ($q) => $q->where('user_id', $user->users_id)])
            ->orderBy('level')
            ->get()
            ->map(function (MainQuest $quest) use ($user) {
                $quest->setAttribute('is_completed', $quest->isCompletedForUser($user->users_id));

                return $quest;
            });

        return Inertia::render('MainQuest/Index', [
            'community' => $community,
            'mainQuests' => $quests,
        ]);
    }

    public function show(Request $request, MainQuest $mainQuest): Response
    {
        $user = $request->user();

        $mainQuest->load([
            'community',
            'materials' => fn ($q) => $q->orderBy('order_number'),
            'materials.files',
            // Wajib load sampai questions.options — QuizPanel di frontend
            // memanggil quiz.questions.map(...) langsung. Kalau relasi ini
            // tidak di-load, `questions` hilang dari JSON dan React crash
            // (undefined.map), yang di app bertema gelap ini terlihat
            // seperti "blackscreen".
            'materials.quizzes.questions' => fn ($q) => $q->orderBy('order_number'),
            'materials.quizzes.questions.options' => function ($q) {
                // Jangan bocorkan is_correct ke user yang belum submit.
                $q->select('quiz_options_id', 'question_id', 'option_label', 'option_text');
            },
            // Riwayat kelulusan quiz & submission practice milik user ini —
            // dipakai frontend supaya QuizPanel/PracticePanel tahu kalau
            // sudah pernah lulus/submit dan tidak menampilkan seolah-olah
            // belum pernah dikerjakan sama sekali.
            'materials.quizzes.attempts' => fn ($q) => $q->where('user_id', $user->users_id)->latest('finished_at'),
            'materials.practices',
            'materials.practices.submissions' => fn ($q) => $q->where('user_id', $user->users_id)->latest('submitted_at'),
            'materials.practices.submissions.review.reviewer:users_id,name',
            'materials.progress' => fn ($q) => $q->where('user_id', $user->users_id),
        ]);

        // Tambahkan flag ringkas per quiz/practice tanpa mengekspos seluruh
        // riwayat attempt/submission user lain ke frontend.
        foreach ($mainQuest->materials as $material) {
            foreach ($material->quizzes as $quiz) {
                $quiz->setAttribute('user_has_passed', $quiz->attempts->contains('is_passed', true));
                $quiz->unsetRelation('attempts');
            }

            foreach ($material->practices as $practice) {
                $latestSubmission = $practice->submissions->first();
                $practice->setAttribute('user_submission_status', $latestSubmission?->status);
                // Hanya submission & review milik user yang sedang login
                // (relasi di-filter user_id di atas), tidak ada data member lain.
                $practice->setAttribute('user_submission', $latestSubmission ? [
                    'status' => $latestSubmission->status,
                    'video_title' => $latestSubmission->video_title,
                    'submitted_at' => $latestSubmission->submitted_at,
                    'review' => $latestSubmission->review ? [
                        'score' => $latestSubmission->review->score,
                        'technique_score' => $latestSubmission->review->technique_score,
                        'rhythm_score' => $latestSubmission->review->rhythm_score,
                        'expression_score' => $latestSubmission->review->expression_score,
                        'feedback' => $latestSubmission->review->feedback,
                        'reviewed_at' => $latestSubmission->review->reviewed_at,
                        'reviewer_name' => $latestSubmission->review->reviewer?->name,
                    ] : null,
                ] : null);
                $practice->unsetRelation('submissions');
            }
        }

        return Inertia::render('MainQuest/Show', [
            'mainQuest' => $mainQuest,
            'canManage' => $request->user()->can('manage', $mainQuest->community),
        ]);
    }
}