<?php

namespace Database\Seeders;

use App\Models\Achievement;
use Illuminate\Database\Seeder;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $achievements = [
            ['title' => 'Penuntas Birama', 'description' => 'Menyelesaikan seluruh 7 level Main Quest di satu komunitas.', 'xp_reward' => 500, 'point_reward' => 100],
            ['title' => 'Konsisten 7 Hari', 'description' => 'Menyelesaikan daily mission 7 hari berturut-turut.', 'xp_reward' => 150, 'point_reward' => 30],
            ['title' => 'Kontributor Forum', 'description' => 'Mendapatkan 50 like di forum diskusi.', 'xp_reward' => 100, 'point_reward' => 20],
        ];

        foreach ($achievements as $achievement) {
            Achievement::updateOrCreate(['title' => $achievement['title']], $achievement);
        }
    }
}
