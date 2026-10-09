<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\ChallengeSubmission;
use App\Services\GamificationService;
use App\Services\NotificationService;
use App\Support\UploadLimits;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ChallengeSubmissionController extends Controller
{
    public function __construct(
        protected GamificationService $gamification,
        protected NotificationService $notifications,
    ) {
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
            'file_size' => ['nullable', 'integer', 'min:1', 'max:'.UploadLimits::MAX_BYTES],
        ]);

        $submission = $challenge->submissions()->create([
            ...$data,
            'user_id' => $request->user()->users_id,
            'submitted_at' => now(),
            'status' => 'Pending',
        ]);

        $this->notifications->sendToCommunityRoles(
            $challenge->community,
            ['Ketua', 'Wakil Ketua', 'Staff'],
            NotificationService::TYPE_CHALLENGE,
            'Submission challenge baru',
            "{$request->user()->name} mengirim submission untuk challenge \"{$challenge->title}\" dan menunggu review.",
            $submission,
            $request->user()->users_id,
        );

        return response()->json($submission, 201);
    }

    /**
     * Riwayat submission milik user yang sedang login untuk challenge ini.
     * Tidak pernah memuat submission user lain.
     */
    public function mine(Request $request, Challenge $challenge): JsonResponse
    {
        return response()->json(
            $challenge->submissions()
                ->where('user_id', $request->user()->users_id)
                ->with('reviewer:users_id,name')
                ->latest('submitted_at')
                ->get()
        );
    }

    /**
     * Detail 1 submission challenge beserta hasil review-nya. Member hanya
     * boleh melihat miliknya sendiri; Ketua/Wakil Ketua/Staff boleh melihat
     * semua submission di komunitasnya.
     */
    public function show(Request $request, ChallengeSubmission $submission): JsonResponse
    {
        $submission->load(['challenge.community', 'reviewer:users_id,name']);

        if ((int) $submission->user_id !== (int) $request->user()->users_id) {
            $this->authorize('review', $submission->challenge->community);
        }

        return response()->json($submission);
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

        $this->notifications->send(
            $submission->user_id,
            NotificationService::TYPE_CHALLENGE,
            match ($data['status']) {
                'Approved' => 'Challenge disetujui',
                'Revision' => 'Challenge perlu revisi',
                default => 'Challenge ditolak',
            },
            "Submission challenge \"{$challenge->title}\" kamu berstatus {$data['status']}."
                .(! empty($data['feedback']) ? " Feedback: {$data['feedback']}" : ''),
            $submission,
        );

        if ($data['status'] === 'Approved') {
            $user = $submission->user;
            $categoryId = $challenge->instrument->category_id ?? null;

            $this->gamification->addXp($user, (int) $challenge->xp_reward, $categoryId, "Challenge: {$challenge->title}");
            $this->gamification->addPoint($user, (int) $challenge->point_reward, 'Challenge Approved', ChallengeSubmission::class, $submission->challenge_submissions_id, categoryId: $categoryId);
            $this->gamification->unlockAchievement($user, 'first_challenge_won');
        }

        return response()->json($submission->fresh());
    }
}