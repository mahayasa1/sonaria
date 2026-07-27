<?php

use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\DashboardController;
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

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

    // Satu pintu masuk dashboard — otomatis dialihkan ke tampilan yang
    // sesuai role (Admin/Ketua/Wakil Ketua/Staff/Member) di DashboardController.
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    /*
    |----------------------------------------------------------------------
    | Halaman berikut ROUTE-nya sudah didukung penuh di routes/api.php
    | (CommunityController, MainQuestController, DailyMissionController,
    | ChallengeController, ForumPostController, dst) tapi komponen Inertia-
    | nya belum dibuat di langkah sebelumnya. Tambahkan begitu halaman
    | React-nya siap, mengikuti pola yang sama seperti /dashboard di atas:
    |
    | Route::get('/onboarding/category', [OnboardingWebController::class, 'category'])->name('onboarding.category');
    | Route::get('/onboarding/instrument', [OnboardingWebController::class, 'instrument'])->name('onboarding.instrument');
    | Route::get('/communities', [CommunityWebController::class, 'index'])->name('communities.index');
    | Route::get('/communities/{community}', [CommunityWebController::class, 'show'])->name('communities.show');
    | Route::get('/main-quests', [MainQuestWebController::class, 'index'])->name('main-quests.index');
    | Route::get('/main-quests/{mainQuest}', [MainQuestWebController::class, 'show'])->name('main-quests.show');
    | Route::get('/daily-missions', [DailyMissionWebController::class, 'index'])->name('daily-missions.index');
    | Route::get('/challenge', [ChallengeWebController::class, 'index'])->name('challenge.index');
    | Route::get('/forum', [ForumWebController::class, 'index'])->name('forum.index');
    | Route::get('/forum/{forumPost}', [ForumWebController::class, 'show'])->name('forum.show');
    |
    | Route::get('/manage/members', [ManageWebController::class, 'members'])->name('manage.members');
    | Route::get('/manage/main-quests', [ManageWebController::class, 'mainQuests'])->name('manage.main-quests');
    | Route::get('/manage/daily-missions', [ManageWebController::class, 'dailyMissions'])->name('manage.daily-missions');
    | Route::get('/manage/challenge', [ManageWebController::class, 'challenge'])->name('manage.challenge');
    | Route::get('/manage/reviews', [ManageWebController::class, 'reviews'])->name('manage.reviews');
    |
    | Route::get('/admin/users', [AdminWebController::class, 'users'])->name('admin.users');
    | Route::get('/admin/communities', [AdminWebController::class, 'communities'])->name('admin.communities');
    | Route::get('/admin/settings', [AdminWebController::class, 'settings'])->name('admin.settings');
    |----------------------------------------------------------------------
    */

require __DIR__.'/settings.php';

Route::prefix('api')->group(function () {
    require __DIR__.'/api.php';
});