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

            // Data contoh untuk uji coba alur end-to-end (opsional untuk
            // production — komentari baris ini kalau tidak diperlukan)
            DemoDataSeeder::class,
        ]);
    }
}
