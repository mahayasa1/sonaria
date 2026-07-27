<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            ['badge_name' => 'Langkah Pertama', 'description' => 'Menyelesaikan main quest level 1.', 'xp_required' => 0, 'point_required' => 0],
            ['badge_name' => 'Rajin Berlatih', 'description' => 'Menyelesaikan 10 daily mission.', 'xp_required' => 0, 'point_required' => 0],
            ['badge_name' => 'Juara Challenge', 'description' => 'Submission challenge disetujui dengan skor sempurna.', 'xp_required' => 0, 'point_required' => 0],
            ['badge_name' => 'Konduktor', 'description' => 'Mencapai level 7 dan membuat komunitas sendiri.', 'xp_required' => 8000, 'point_required' => 0],
        ];

        foreach ($badges as $badge) {
            Badge::updateOrCreate(['badge_name' => $badge['badge_name']], $badge);
        }
    }
}
