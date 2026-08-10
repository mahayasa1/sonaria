<?php

use App\Http\Controllers\Api\Admin\AchievementController as AdminAchievementController;
use App\Http\Controllers\Api\Admin\BadgeController as AdminBadgeController;
use App\Http\Controllers\Api\Admin\LevelController as AdminLevelController;
use App\Http\Controllers\Api\Admin\MusicCategoryController as AdminMusicCategoryController;
use App\Http\Controllers\Api\Admin\RoleController as AdminRoleController;
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
use App\Http\Controllers\Api\MaterialFileController;
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

Route::middleware('auth')->group(function () {
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
    Route::post('/communities/{community:communities_id}/leave', [CommunityController::class, 'leave']);
    Route::put('/communities/{community:communities_id}/members/{member:community_members_id}', [CommunityController::class, 'updateMemberRole']);
    Route::delete('/communities/{community:communities_id}/members/{member:community_members_id}', [CommunityController::class, 'removeMember']);
    Route::get('/communities/{community:communities_id}/join-requests', [CommunityController::class, 'joinRequests']);
    Route::post('/communities/{community:communities_id}/join-requests/{joinRequest}/approve', [CommunityController::class, 'approveJoinRequest']);
    Route::post('/communities/{community:communities_id}/join-requests/{joinRequest}/reject', [CommunityController::class, 'rejectJoinRequest']);

    // ==== Main Quest (7 level) ====
    Route::get('/communities/{community:communities_id}/main-quests', [MainQuestController::class, 'index']);
    Route::post('/communities/{community:communities_id}/main-quests', [MainQuestController::class, 'store']);
    Route::get('/main-quests/{mainQuest:main_quests_id}', [MainQuestController::class, 'show']);

    // ==== Materi ====
    Route::get('/materials/{material:materials_id}', [MaterialController::class, 'show']);
    Route::post('/main-quests/{mainQuest:main_quests_id}/materials', [MaterialController::class, 'store']);
    Route::post('/materials/{material:materials_id}/progress', [MaterialController::class, 'updateProgress']);

    // ==== File Materi (video/PDF/audio/gambar pada sebuah Learning Material) ====
    Route::get('/materials/{material:materials_id}/files', [MaterialFileController::class, 'index']);
    Route::post('/materials/{material:materials_id}/files', [MaterialFileController::class, 'store']);
    Route::get('/material-files/{materialFile:material_files_id}', [MaterialFileController::class, 'show']);
    Route::put('/material-files/{materialFile:material_files_id}', [MaterialFileController::class, 'update']);
    Route::delete('/material-files/{materialFile:material_files_id}', [MaterialFileController::class, 'destroy']);

    // ==== Practice (misi video latihan) ====
    Route::get('/practices/{practice:practices_id}', [PracticeController::class, 'show']);
    Route::post('/materials/{material:materials_id}/practices', [PracticeController::class, 'store']);
    Route::post('/practices/{practice:practices_id}/submissions', [PracticeSubmissionController::class, 'store']);
    Route::get('/practices/{practice:practices_id}/submissions', [PracticeSubmissionController::class, 'index']);
    Route::post('/practice-submissions/{submission:practice_submissions_id}/review', [PracticeSubmissionController::class, 'review']);

    // ==== Quiz ====
    Route::get('/quizzes/{quiz:quizzes_id}', [QuizController::class, 'show']);
    Route::post('/materials/{material:materials_id}/quizzes', [QuizController::class, 'store']);
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

    // ==== Admin: Roles, Levels, Kategori Alat Musik, Badge, Achievement ====
    // Otorisasi Admin dicek di dalam masing-masing controller (EnsuresAdmin::ensureAdmin).
    Route::prefix('admin')->group(function () {
        Route::get('/roles', [AdminRoleController::class, 'index']);
        Route::post('/roles', [AdminRoleController::class, 'store']);
        Route::put('/roles/{role:role_id}', [AdminRoleController::class, 'update']);
        Route::delete('/roles/{role:role_id}', [AdminRoleController::class, 'destroy']);

        Route::get('/levels', [AdminLevelController::class, 'index']);
        Route::post('/levels', [AdminLevelController::class, 'store']);
        Route::put('/levels/{level:level_id}', [AdminLevelController::class, 'update']);
        Route::delete('/levels/{level:level_id}', [AdminLevelController::class, 'destroy']);

        Route::get('/categories', [AdminMusicCategoryController::class, 'index']);
        Route::post('/categories', [AdminMusicCategoryController::class, 'store']);
        Route::put('/categories/{category:music_categories_id}', [AdminMusicCategoryController::class, 'update']);
        Route::delete('/categories/{category:music_categories_id}', [AdminMusicCategoryController::class, 'destroy']);
        Route::post('/categories/{category:music_categories_id}/instruments', [AdminMusicCategoryController::class, 'storeInstrument']);
        Route::delete('/instruments/{instrument:intruments_id}', [AdminMusicCategoryController::class, 'destroyInstrument']);

        Route::get('/badges', [AdminBadgeController::class, 'index']);
        Route::post('/badges', [AdminBadgeController::class, 'store']);
        Route::put('/badges/{badge:badges_id}', [AdminBadgeController::class, 'update']);
        Route::delete('/badges/{badge:badges_id}', [AdminBadgeController::class, 'destroy']);

        Route::get('/achievements', [AdminAchievementController::class, 'index']);
        Route::post('/achievements', [AdminAchievementController::class, 'store']);
        Route::put('/achievements/{achievement:achievements_id}', [AdminAchievementController::class, 'update']);
        Route::delete('/achievements/{achievement:achievements_id}', [AdminAchievementController::class, 'destroy']);
    });
});
