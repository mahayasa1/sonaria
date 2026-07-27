<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChallengeController;
use App\Http\Controllers\Api\ChallengeSubmissionController;
use App\Http\Controllers\Api\CommunityController;
use App\Http\Controllers\Api\DailyMissionController;
use App\Http\Controllers\Api\ForumCommentController;
use App\Http\Controllers\Api\ForumPostController;
use App\Http\Controllers\Api\LeaderboardController;
use App\Http\Controllers\Api\MainQuestController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OnboardingController;
use App\Http\Controllers\Api\PracticeController;
use App\Http\Controllers\Api\PracticeSubmissionController;
use App\Http\Controllers\Api\QuizAttemptController;
use App\Http\Controllers\Api\QuizController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Sonaria API Routes
|--------------------------------------------------------------------------
| Mengikuti alur: Login -> Pilih Kategori -> Cari Komunitas -> Halaman
| Komunitas (Main Quest, Daily Mission, Challenge, Forum).
*/

// ==== Auth (publik) ====
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // ==== Onboarding: pilih kategori & instrument ====
    Route::get('/categories', [OnboardingController::class, 'categories']);
    Route::get('/categories/{category:music_categories_id}/instruments', [OnboardingController::class, 'instruments']);
    Route::post('/onboarding/instrument', [OnboardingController::class, 'selectInstrument']);

    // ==== Komunitas ====
    Route::get('/communities', [CommunityController::class, 'index']);
    Route::post('/communities', [CommunityController::class, 'store']);
    Route::get('/communities/{community:communities_id}', [CommunityController::class, 'show']);
    Route::post('/communities/{community:communities_id}/join', [CommunityController::class, 'join']);
    Route::get('/communities/{community:communities_id}/join-requests', [CommunityController::class, 'joinRequests']);
    Route::post('/communities/{community:communities_id}/join-requests/{joinRequest}/approve', [CommunityController::class, 'approveJoinRequest']);
    Route::post('/communities/{community:communities_id}/join-requests/{joinRequest}/reject', [CommunityController::class, 'rejectJoinRequest']);

    // ==== Main Quest (7 level) ====
    Route::get('/communities/{community:communities_id}/main-quests', [MainQuestController::class, 'index']);
    Route::post('/communities/{community:communities_id}/main-quests', [MainQuestController::class, 'store']);
    Route::get('/main-quests/{mainQuest:main_quests_id}', [MainQuestController::class, 'show']);

    // ==== Materi ====
    Route::get('/materials/{material:materials_id}', [MaterialController::class, 'show']);
    Route::post('/materials/{material:materials_id}/progress', [MaterialController::class, 'updateProgress']);

    // ==== Practice (misi video latihan) ====
    Route::get('/practices/{practice:practices_id}', [PracticeController::class, 'show']);
    Route::post('/practices/{practice:practices_id}/submissions', [PracticeSubmissionController::class, 'store']);
    Route::get('/practices/{practice:practices_id}/submissions', [PracticeSubmissionController::class, 'index']);
    Route::post('/practice-submissions/{submission:practice_submissions_id}/review', [PracticeSubmissionController::class, 'review']);

    // ==== Quiz ====
    Route::get('/quizzes/{quiz:quizzes_id}', [QuizController::class, 'show']);
    Route::post('/quizzes/{quiz:quizzes_id}/attempts', [QuizAttemptController::class, 'start']);
    Route::post('/quiz-attempts/{attempt:quiz_attempts_id}/submit', [QuizAttemptController::class, 'submit']);

    // ==== Daily Mission (6 slot, reward acak kecil) ====
    Route::get('/communities/{community:communities_id}/daily-missions', [DailyMissionController::class, 'index']);
    Route::post('/communities/{community:communities_id}/daily-missions', [DailyMissionController::class, 'store']);
    Route::post('/daily-missions/{mission:daily_missions_id}/complete', [DailyMissionController::class, 'complete']);

    // ==== Challenge (1 aktif, reward besar) ====
    Route::get('/communities/{community:communities_id}/challenge', [ChallengeController::class, 'index']);
    Route::post('/communities/{community:communities_id}/challenges', [ChallengeController::class, 'store']);
    Route::get('/challenges/{challenge:challenges_id}', [ChallengeController::class, 'show']);
    Route::post('/challenges/{challenge:challenges_id}/submissions', [ChallengeSubmissionController::class, 'store']);
    Route::get('/challenges/{challenge:challenges_id}/submissions', [ChallengeSubmissionController::class, 'index']);
    Route::post('/challenge-submissions/{submission:challenge_submissions_id}/review', [ChallengeSubmissionController::class, 'review']);

    // ==== Leaderboard ====
    Route::get('/communities/{community:communities_id}/leaderboard', [LeaderboardController::class, 'index']);

    // ==== Forum (di bawah Daily Mission & Challenge) ====
    Route::get('/communities/{community:communities_id}/forum-posts', [ForumPostController::class, 'index']);
    Route::post('/communities/{community:communities_id}/forum-posts', [ForumPostController::class, 'store']);
    Route::get('/forum-posts/{forumPost:forum_posts_id}', [ForumPostController::class, 'show']);
    Route::put('/forum-posts/{forumPost:forum_posts_id}', [ForumPostController::class, 'update']);
    Route::delete('/forum-posts/{forumPost:forum_posts_id}', [ForumPostController::class, 'destroy']);
    Route::post('/forum-posts/{forumPost:forum_posts_id}/like', [ForumPostController::class, 'toggleLike']);
    Route::post('/forum-posts/{forumPost:forum_posts_id}/comments', [ForumCommentController::class, 'store']);
    Route::delete('/forum-comments/{forumComment:forum_comments_id}', [ForumCommentController::class, 'destroy']);

    // ==== Notifikasi ====
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification:notifications_id}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
});
