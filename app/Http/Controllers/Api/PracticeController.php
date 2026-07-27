<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Practice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PracticeController extends Controller
{
    public function show(Request $request, Practice $practice): JsonResponse
    {
        $user = $request->user();

        $practice->load('material');
        $mySubmission = $practice->submissions()
            ->where('user_id', $user->users_id)
            ->latest('submitted_at')
            ->first();

        return response()->json([
            'practice' => $practice,
            'my_submission' => $mySubmission,
        ]);
    }
}
