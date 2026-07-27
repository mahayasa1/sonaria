<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    /**
     * 7 level global (selaras dengan 7 birama Main Quest). Level 7 adalah
     * satu-satunya level yang boleh membuat komunitas sendiri.
     */
    public function run(): void
    {
        $levels = [
            ['level' => 1, 'title' => 'Pemula Nada', 'min_xp' => 0, 'max_xp' => 499, 'color' => '#9C93A8', 'can_create_community' => false],
            ['level' => 2, 'title' => 'Penjaga Tempo', 'min_xp' => 500, 'max_xp' => 999, 'color' => '#4C8C86', 'can_create_community' => false],
            ['level' => 3, 'title' => 'Perangkai Chord', 'min_xp' => 1000, 'max_xp' => 1999, 'color' => '#4C8C86', 'can_create_community' => false],
            ['level' => 4, 'title' => 'Penabuh Ritme', 'min_xp' => 2000, 'max_xp' => 3499, 'color' => '#D9A441', 'can_create_community' => false],
            ['level' => 5, 'title' => 'Pengukir Melodi', 'min_xp' => 3500, 'max_xp' => 5499, 'color' => '#D9A441', 'can_create_community' => false],
            ['level' => 6, 'title' => 'Maestro Muda', 'min_xp' => 5500, 'max_xp' => 7999, 'color' => '#D9A441', 'can_create_community' => false],
            ['level' => 7, 'title' => 'Konduktor Komunitas', 'min_xp' => 8000, 'max_xp' => 999999, 'color' => '#C1443C', 'can_create_community' => true],
        ];

        foreach ($levels as $level) {
            Level::updateOrCreate(['level' => $level['level']], $level);
        }
    }
}
