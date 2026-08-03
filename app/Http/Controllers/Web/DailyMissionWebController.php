<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Concerns\ResolvesActiveCommunity;
use App\Http\Controllers\Controller;
use App\Models\DailyMission;
use App\Models\UserDailyMission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DailyMissionWebController extends Controller
{
    use ResolvesActiveCommunity;

    /**
     * Mirror App\Http\Controllers\Api\DailyMissionController::index.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $membership = $this->activeMembership($user);

        if (! $membership) {
            return redirect()->route('communities.index')
                ->with('error', 'Gabung ke sebuah komunitas dulu untuk melihat Daily Mission.');
        }

        $community = $membership->community;
        $today = now()->toDateString();

        $missions = $community->dailyMissions()
            ->where('status', 'Active')
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->orderBy('mission_number')
            ->with('quiz')
            ->get()
            ->map(function (DailyMission $mission) use ($user) {
                $mission->setRelation(
                    'my_progress',
                    UserDailyMission::where('mission_id', $mission->daily_missions_id)
                        ->where('user_id', $user->users_id)
                        ->first()
                );

                return $mission;
            });

        return Inertia::render('DailyMission/Index', [
            'community' => $community,
            'dailyMissions' => $missions,
        ]);
    }
}
