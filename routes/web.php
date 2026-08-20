<?php

use App\Http\Controllers\Web\AdminWebController;
use App\Http\Controllers\Web\ChallengeWebController;
use App\Http\Controllers\Web\CommunityWebController;
use App\Http\Controllers\Web\DailyMissionWebController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\ForumWebController;
use App\Http\Controllers\Web\LeaderboardWebController;
use App\Http\Controllers\Web\MainQuestWebController;
use App\Http\Controllers\Web\ManageWebController;
use App\Http\Controllers\Web\OnboardingWebController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Sonaria Web Routes (Inertia + session auth)
|--------------------------------------------------------------------------
| File ini hanya untuk halaman yang di-render Inertia (React). Endpoint
| data/JSON untuk AJAX (join komunitas, submit quiz, dsb.) ada di routes/api.php
| dan dipakai lewat fetch/axios dari dalam komponen React yang sama.
|
| Alur: Landing -> Login/Register -> Dashboard (otomatis diarahkan ke
| tampilan Admin / Ketua / Wakil Ketua / Staff / Member sesuai role user).
*/

// ==== Publik ====
Route::get('/', fn () => Inertia::render('Landing'))->name('landing');

// Login, Register, Logout, Reset/Verifikasi Email, 2FA, Passkey, Confirm
// Password: semua ditangani oleh Laravel Fortify (lihat
// app/Providers/FortifyServiceProvider.php untuk view & action-nya, serta
// config/fortify.php untuk fitur mana yang aktif). Dulu ada AuthController
// custom yang mendaftarkan /login & /register secara terpisah — itu
// menyebabkan fitur Fortify seperti reset password, verifikasi email, dan
// rate limiting login jadi tidak pernah benar-benar terpakai. Sekarang
// Fortify adalah satu-satunya sumber untuk route-route auth tersebut.

Route::middleware('auth')->group(function () {
    // Satu pintu masuk dashboard — otomatis dialihkan ke tampilan yang
    // sesuai role (Admin/Ketua/Wakil Ketua/Staff/Member) di DashboardController.
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // ==== Onboarding: pilih kategori & instrument (alur no. 3) ====
    Route::get('/onboarding/category', [OnboardingWebController::class, 'category'])->name('onboarding.category');
    Route::post('/onboarding/instrument', [OnboardingWebController::class, 'storeInstrument'])->name('onboarding.instrument');

    // ==== Cari & gabung komunitas (alur no. 4) ====
    Route::get('/communities', [CommunityWebController::class, 'index'])->name('communities.index');
    // '/communities/create' HARUS didaftarkan sebelum '/communities/{community}'
    // supaya "create" tidak ditangkap sebagai route model binding communities_id.
    Route::get('/communities/create', [CommunityWebController::class, 'create'])->name('communities.create');
    Route::get('/communities/{community:communities_id}', [CommunityWebController::class, 'show'])->name('communities.show');
    Route::post('/communities/{community:communities_id}/join', [CommunityWebController::class, 'join'])->name('communities.join');
    Route::post('/communities/{community:communities_id}/leave', [CommunityWebController::class, 'leave'])->name('communities.leave');

    // ==== Dashboard komunitas: Main Quest, Daily Mission, Challenge, Forum, Leaderboard (alur no. 5) ====
    // 'community.active' menolak akses kalau komunitas aktif user sedang
    // di-nonaktifkan Admin (TC-ADC-002) — lihat App\Http\Middleware\EnsureCommunityIsActive.
    Route::middleware('community.active')->group(function () {
        Route::get('/main-quests', [MainQuestWebController::class, 'index'])->name('main-quests.index');
        Route::get('/main-quests/{mainQuest:main_quests_id}', [MainQuestWebController::class, 'show'])->name('main-quests.show');
        Route::get('/daily-missions', [DailyMissionWebController::class, 'index'])->name('daily-missions.index');
        Route::get('/challenge', [ChallengeWebController::class, 'index'])->name('challenge.index');
        Route::get('/forum', [ForumWebController::class, 'index'])->name('forum.index');
        Route::get('/forum/{forumPost:forum_posts_id}', [ForumWebController::class, 'show'])->name('forum.show');
        Route::get('/leaderboard', [LeaderboardWebController::class, 'index'])->name('leaderboard.index');

        // ==== Manage: khusus Ketua/Wakil Ketua (buat konten) & +Staff (review) ====
        Route::get('/manage/members', [ManageWebController::class, 'members'])->name('manage.members');
        Route::get('/manage/reviews', [ManageWebController::class, 'reviews'])->name('manage.reviews');
        Route::get('/manage/main-quests/create', [ManageWebController::class, 'mainQuestCreate'])->name('manage.main-quests.create');
        Route::get('/manage/main-quests/{mainQuest:main_quests_id}/materials/create', [ManageWebController::class, 'materialCreate'])->name('manage.materials.create');
        Route::get('/manage/materials/{material:materials_id}/quizzes/create', [ManageWebController::class, 'quizCreate'])->name('manage.quizzes.create');
        Route::get('/manage/materials/{material:materials_id}/practices/create', [ManageWebController::class, 'practiceCreate'])->name('manage.practices.create');
        Route::get('/manage/materials/{material:materials_id}/files/create', [ManageWebController::class, 'materialFileCreate'])->name('manage.material-files.create');
        Route::get('/manage/daily-missions', [ManageWebController::class, 'dailyMissions'])->name('manage.daily-missions.index');
        Route::get('/manage/daily-missions/create', [ManageWebController::class, 'dailyMissionCreate'])->name('manage.daily-missions.create');
        Route::get('/manage/challenges', [ManageWebController::class, 'challenges'])->name('manage.challenges.index');
        Route::get('/manage/challenge/create', [ManageWebController::class, 'challengeCreate'])->name('manage.challenge.create');
        Route::get('/manage/practice-submissions/{submission:practice_submissions_id}', [ManageWebController::class, 'reviewPractice'])->name('manage.practice-submissions.show');
        Route::get('/manage/challenge-submissions/{submission:challenge_submissions_id}', [ManageWebController::class, 'reviewChallenge'])->name('manage.challenge-submissions.show');
    });

    // ==== Admin ====
    Route::get('/admin/users', [AdminWebController::class, 'users'])->name('admin.users');
    Route::post('/admin/users/{user:users_id}/toggle-status', [AdminWebController::class, 'toggleUserStatus'])->name('admin.users.toggle-status');
    Route::put('/admin/users/{user}', [AdminWebController::class, 'updateUser'])->name('admin.users.update');
    Route::delete('/admin/users/{user}', [AdminWebController::class, 'destroyUser'])->name('admin.users.destroy');
    Route::get('/admin/communities', [AdminWebController::class, 'communities'])->name('admin.communities');
    Route::post('/admin/communities/{community:communities_id}/toggle-status', [AdminWebController::class, 'toggleCommunityStatus'])->name('admin.communities.toggle-status');
    Route::put('/admin/communities/{community}', [AdminWebController::class, 'updateCommunity'])->name('admin.communities.update');
    Route::delete('/admin/communities/{community}', [AdminWebController::class, 'destroyCommunity'])->name('admin.communities.destroy');
    Route::get('/admin/categories', [AdminWebController::class, 'categories'])->name('admin.categories');
    Route::post('/admin/categories', [AdminWebController::class, 'storeCategory'])->name('admin.categories.store');
    Route::delete('/admin/categories/{category:music_categories_id}', [AdminWebController::class, 'destroyCategory'])->name('admin.categories.destroy');
    Route::post('/admin/categories/{category:music_categories_id}/instruments', [AdminWebController::class, 'storeInstrument'])->name('admin.instruments.store');
    Route::delete('/admin/instruments/{instrument:intruments_id}', [AdminWebController::class, 'destroyInstrument'])->name('admin.instruments.destroy');
    Route::get('/admin/achievements', [AdminWebController::class, 'achievements'])->name('admin.achievements');
    Route::post('/admin/achievements', [AdminWebController::class, 'storeAchievement'])->name('admin.achievements.store');
    Route::delete('/admin/achievements/{achievement:achievements_id}', [AdminWebController::class, 'destroyAchievement'])->name('admin.achievements.destroy');
    Route::get('/admin/badges', [AdminWebController::class, 'badges'])->name('admin.badges');
    Route::post('/admin/badges', [AdminWebController::class, 'storeBadge'])->name('admin.badges.store');
    Route::delete('/admin/badges/{badge:badges_id}', [AdminWebController::class, 'destroyBadge'])->name('admin.badges.destroy');
    Route::get('/admin/settings', [AdminWebController::class, 'settings'])->name('admin.settings');

});

require __DIR__.'/settings.php';

Route::prefix('api')->group(function () {
    require __DIR__.'/api.php';
});