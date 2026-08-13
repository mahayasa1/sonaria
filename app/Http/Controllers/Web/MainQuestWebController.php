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
            ->map(function (MainQuest $quest) {
                $quest->setAttribute('is_completed', $this->isQuestCompleted($quest));

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
            'materials.practices',
            'materials.progress' => fn ($q) => $q->where('user_id', $user->users_id),
        ]);

        return Inertia::render('MainQuest/Show', [
            'mainQuest' => $mainQuest,
            'canManage' => $request->user()->can('manage', $mainQuest->community),
        ]);
    }

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
