<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // Master / reference data — urutan penting karena saling terkait FK
            RoleSeeder::class,
            LevelSeeder::class,
            MusicCategorySeeder::class,
            InstrumentSeeder::class,
            CommunityRoleSeeder::class,
            BadgeSeeder::class,
            AchievementSeeder::class,

            // Data testing komprehensif untuk QA/E2E manual: 1 admin + 15 user
            // lintas level, 4 komunitas dengan kondisi berbeda, konten belajar
            // lengkap (quest/material/practice/quiz), gamifikasi, forum,
            // notifikasi, activity log, dan media file. Urutan di bawah ini
            // WAJIB dijaga karena tiap seeder bergantung pada data seeder
            // sebelumnya (mis. Quiz butuh Material, Gamification butuh XP dari
            // Quiz/Practice/DailyMission/Challenge yang sudah tercatat).
            //
            // Catatan: DemoDataSeeder (data contoh single-community lama) TIDAK
            // dipanggil lagi di sini supaya tidak menghasilkan data ganda yang
            // membingungkan saat QA manual. File-nya tetap dipertahankan dan
            // masih bisa dipanggil manual (php artisan db:seed --class=DemoDataSeeder)
            // kalau sewaktu-waktu dibutuhkan.
            TestingUserSeeder::class,
            TestingCommunitySeeder::class,
            TestingQuestSeeder::class,
            TestingMaterialSeeder::class,
            TestingPracticeSeeder::class,
            TestingQuizSeeder::class,
            TestingChallengeSeeder::class,
            TestingGamificationSeeder::class,
            TestingForumSeeder::class,
            TestingNotificationSeeder::class,
            TestingActivityLogSeeder::class,
            TestingMediaSeeder::class,
        ]);
    }
}
