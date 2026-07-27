<?php

namespace Database\Seeders;

use App\Models\MusicCategory;
use Illuminate\Database\Seeder;

class MusicCategorySeeder extends Seeder
{
    /**
     * Hanya 4 kategori tetap sesuai brief Sonaria — jangan ditambah dinamis oleh user.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Percussion', 'description' => 'Drum, kendang, marimba, dan alat pukul lainnya.'],
            ['name' => 'Woodwind', 'description' => 'Seruling, klarinet, saksofon, dan alat tiup kayu.'],
            ['name' => 'Brass', 'description' => 'Trompet, trombon, French horn, dan alat tiup logam.'],
            ['name' => 'String', 'description' => 'Gitar, biola, cello, dan alat musik dawai.'],
        ];

        foreach ($categories as $category) {
            MusicCategory::updateOrCreate(['name' => $category['name']], $category);
        }
    }
}
