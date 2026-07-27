<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Community;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index(Request $request, Community $community): JsonResponse
    {
        $period = $request->string('period', 'Weekly');

        $leaderboard = $community->leaderboards()
            ->where('period', $period)
            ->with('user')
            ->orderBy('rank')
            ->get();

        return response()->json($leaderboard);
    }
}
