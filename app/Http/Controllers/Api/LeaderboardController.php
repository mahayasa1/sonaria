<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Services\LeaderboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function __construct(protected LeaderboardService $leaderboardService)
    {
    }

    public function index(Request $request, Community $community): JsonResponse
    {
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

        return response()->json($leaderboard);
    }
}
