<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Practice;
use App\Models\PracticeReview;
use App\Models\PracticeSubmission;
use App\Services\GamificationService;
use App\Support\UploadLimits;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PracticeSubmissionController extends Controller
{
    public function __construct(protected GamificationService $gamification)
    {
    }

    /**
     * User submit video latihan untuk sebuah practice.
     */
    public function store(Request $request, Practice $practice): JsonResponse
    {
        if ($practice->deadline && now()->greaterThan($practice->deadline)) {
            throw ValidationException::withMessages([
                'deadline' => ['Batas waktu pengumpulan practice ini sudah lewat.'],
            ]);
        }

        $data = $request->validate([
            'video_title' => ['nullable', 'string', 'max:150'],
            'video_path' => ['required', 'string', 'max:255'],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'duration' => ['nullable', 'string', 'max:11'],
            // file_size dikirim dalam byte oleh frontend (dari File.size hasil
            // pilih file, karena video-nya sendiri di-hosting eksternal — lihat
            // catatan TC-FILE-001). Divalidasi di sini supaya upload > 100MB
            // tetap ditolak walau tidak lewat form-data multipart biasa.
            'file_size' => ['nullable', 'integer', 'min:1', 'max:'.UploadLimits::MAX_BYTES],
        ]);

        $submission = $practice->submissions()->create([
            ...$data,
            'user_id' => $request->user()->users_id,
            'submitted_at' => now(),
            'status' => 'Pending',
        ]);

        return response()->json($submission, 201);
    }

    /**
     * Daftar submission untuk direview (khusus Ketua/Wakil Ketua komunitas).
     */
    public function index(Request $request, Practice $practice): JsonResponse
    {
        $community = $practice->material->mainQuest->community;
        $this->authorize('review', $community);

        return response()->json(
            $practice->submissions()->where('status', 'Pending')->with('user')->latest('submitted_at')->get()
        );
    }

    /**
     * Reviewer menilai submission. Jika Approved & skor >= minimum_score, XP/Point dicairkan.
     */
    public function review(Request $request, PracticeSubmission $submission): JsonResponse
    {
        $practice = $submission->practice;
        $community = $practice->material->mainQuest->community;
        $this->authorize('review', $community);

        $data = $request->validate([
            'score' => ['required', 'numeric', 'min:0', 'max:100'],
            'technique_score' => ['nullable', 'numeric'],
            'rhythm_score' => ['nullable', 'numeric'],
            'expression_score' => ['nullable', 'numeric'],
            'feedback' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:Approved,Revision,Rejected'],
        ]);

        $review = PracticeReview::create([
            ...$data,
            'submission_id' => $submission->practice_submissions_id,
            'reviewer_id' => $request->user()->users_id,
            'reviewed_at' => now(),
        ]);

        $submission->update(['status' => $data['status'] === 'Approved' ? 'Approved' : $data['status']]);

        if ($data['status'] === 'Approved' && $data['score'] >= (float) $practice->minimum_score) {
            $user = $submission->user;
            $categoryId = $practice->material->instrument->category_id ?? null;

            // Sama seperti quiz: XP/Point practice cuma cair untuk approval
            // PERTAMA yang lolos minimum_score. Submission/approval berikutnya
            // (mis. user resubmit walau sudah pernah Approved) tidak menambah
            // XP lagi.
            $hasApprovedBefore = PracticeSubmission::where('practice_id', $practice->practices_id)
                ->where('user_id', $user->users_id)
                ->where('status', 'Approved')
                ->where('practice_submissions_id', '!=', $submission->practice_submissions_id)
                ->whereHas('review', fn ($q) => $q->where('score', '>=', (float) $practice->minimum_score))
                ->exists();

            if (! $hasApprovedBefore) {
                $this->gamification->addXp($user, (int) $practice->xp_reward, $categoryId, "Practice: {$practice->title}");
                $this->gamification->addPoint($user, (int) $practice->point_reward, 'Practice Approved', PracticeSubmission::class, $submission->practice_submissions_id, categoryId: $categoryId);
                $this->gamification->unlockAchievement($user, 'first_practice_approved');
            }

            if ($practice->material?->mainQuest) {
                $this->gamification->checkMainQuestCompletion($user, $practice->material->mainQuest);
            }
        }

        return response()->json($review, 201);
    }
}
