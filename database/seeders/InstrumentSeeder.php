<?php

namespace Database\Seeders;

use App\Models\Instrument;
use App\Models\MusicCategory;
use Illuminate\Database\Seeder;

class InstrumentSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Percussion' => [
                ['name' => 'Drum Set', 'difficulty' => 'Easy'],
                ['name' => 'Kendang', 'difficulty' => 'Medium'],
                ['name' => 'Marimba', 'difficulty' => 'Hard'],
            ],
            'Woodwind' => [
                ['name' => 'Seruling', 'difficulty' => 'Easy'],
                ['name' => 'Klarinet', 'difficulty' => 'Medium'],
                ['name' => 'Saksofon', 'difficulty' => 'Medium'],
            ],
            'Brass' => [
                ['name' => 'Trompet', 'difficulty' => 'Easy'],
                ['name' => 'Trombon', 'difficulty' => 'Medium'],
                ['name' => 'French Horn', 'difficulty' => 'Hard'],
            ],
            'String' => [
                ['name' => 'Gitar Akustik', 'difficulty' => 'Easy'],
                ['name' => 'Biola', 'difficulty' => 'Medium'],
                ['name' => 'Cello', 'difficulty' => 'Hard'],
            ],
        ];

        foreach ($data as $categoryName => $instruments) {
            $category = MusicCategory::where('name', $categoryName)->first();

            if (! $category) {
                continue;
            }

            foreach ($instruments as $instrument) {
                Instrument::updateOrCreate(
                    ['category_id' => $category->music_categories_id, 'name' => $instrument['name']],
                    [
                        'category_id' => $category->music_categories_id,
                        'name' => $instrument['name'],
                        'difficulty' => $instrument['difficulty'],
                        'description' => "{$instrument['name']} untuk kategori {$categoryName}.",
                    ]
                );
            }
        }
    }
}
