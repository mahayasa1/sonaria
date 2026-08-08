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
            'communityRole' => $membership->role?->role_name,
            'canManage' => $user->can('manage', $community),
        ]);
    }

    public function show(Request $request, MainQuest $mainQuest): Response
    {
        $user = $request->user();

        $mainQuest->load([
            'community',
            'materials' => fn ($q) => $q->orderBy('order_number'),
            'materials.files',
            'materials.quizzes',
            'materials.practices',
            'materials.progress' => fn ($q) => $q->where('user_id', $user->users_id),
        ]);

        $membership = $this->activeMembership($user);

        return Inertia::render('MainQuest/Show', [
            'mainQuest' => $mainQuest,
            'canManage' => $request->user()->can('manage', $mainQuest->community),
            'communityRole' => $membership?->role?->role_name,
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
