<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Concerns\ResolvesActiveCommunity;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardWebController extends Controller
{
    use ResolvesActiveCommunity;

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
        $period = $request->string('period', 'Weekly');

        $leaderboard = $community->leaderboards()
            ->where('period', $period)
            ->with('user')
            ->orderBy('rank')
            ->get();

        return Inertia::render('Leaderboard/Index', [
            'community' => $community,
            'leaderboard' => $leaderboard,
            'period' => (string) $period,
            'myUserId' => $user->users_id,
        ]);
    }
}
