<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Concerns\ResolvesActiveCommunity;
use App\Http\Controllers\Controller;
use App\Services\LeaderboardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardWebController extends Controller
{
    use ResolvesActiveCommunity;

    public function __construct(protected LeaderboardService $leaderboardService)
    {
    }

    /**
     * Mirror App\Http\Controllers\Api\LeaderboardController::index.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $membership = $this->activeMembership($user);

        if (! $membership) {
            return redirect()->route('communities.index')
                ->with('error', 'Gabung ke sebuah komunitas dulu untuk melihat Leaderboard.');
        }

        $community = $membership->community;
        $period = (string) $request->string('period', 'Weekly');

        $rankings = $this->leaderboardService->getRankings($community, $period);

        $leaderboard = $rankings->map(fn ($row) => [
            'leaderboards_id' => $row['user']->users_id,
            'rank' => $row['rank'],
            'total_xp' => $row['total_xp'],
            'total_point' => $row['total_point'],
            'user' => [
                'users_id' => $row['user']->users_id,
                'name' => $row['user']->name,
                'username' => $row['user']->username,
            ],
        ])->values();

        return Inertia::render('Leaderboard/Index', [
            'community' => $community,
            'leaderboard' => $leaderboard,
            'period' => $period,
            'myUserId' => $user->users_id,
        ]);
    }
}
