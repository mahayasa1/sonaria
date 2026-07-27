<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\ChallengeSubmission;
use App\Services\GamificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ChallengeSubmissionController extends Controller
{
    public function __construct(protected GamificationService $gamification)
    {
    }

    public function store(Request $request, Challenge $challenge): JsonResponse
    {
        if ($challenge->status !== 'Active' || now()->greaterThan($challenge->end_date)) {
            throw ValidationException::withMessages([
                'status' => ['Challenge ini sudah tidak menerima submission.'],
            ]);
        }

        $data = $request->validate([
            'video_title' => ['nullable', 'string', 'max:150'],
            'video_path' => ['required', 'string', 'max:255'],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'duration' => ['nullable', 'string', 'max:11'],
            'file_size' => ['nullable', 'integer'],
        ]);

        $submission = $challenge->submissions()->create([
            ...$data,
            'user_id' => $request->user()->users_id,
            'submitted_at' => now(),
            'status' => 'Pending',
        ]);

        return response()->json($submission, 201);
    }

    public function index(Challenge $challenge): JsonResponse
    {
        $this->authorize('review', $challenge->community);

        return response()->json(
            $challenge->submissions()->where('status', 'Pending')->with('user')->latest('submitted_at')->get()
        );
    }

    /**
     * Review submission. Approved -> reward XP besar dicairkan ke user.
     */
    public function review(Request $request, ChallengeSubmission $submission): JsonResponse
    {
        $challenge = $submission->challenge;
        $this->authorize('review', $challenge->community);

        $data = $request->validate([
            'score' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'feedback' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:Approved,Revision,Rejected'],
        ]);

        $submission->update([
            ...$data,
            'reviewed_by' => $request->user()->users_id,
            'reviewed_at' => now(),
        ]);

        if ($data['status'] === 'Approved') {
            $user = $submission->user;
            $categoryId = $challenge->instrument->category_id ?? null;

            $this->gamification->addXp($user, (int) $challenge->xp_reward, $categoryId, "Challenge: {$challenge->title}");
            $this->gamification->addPoint($user, (int) $challenge->point_reward, 'Challenge Approved', ChallengeSubmission::class, $submission->challenge_submissions_id);
        }

        return response()->json($submission->fresh());
    }
}
