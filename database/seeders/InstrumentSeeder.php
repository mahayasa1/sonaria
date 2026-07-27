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
                ['name' => 'Drum Set', 'difficulty' => 'Beginner'],
                ['name' => 'Kendang', 'difficulty' => 'Intermediate'],
                ['name' => 'Marimba', 'difficulty' => 'Advanced'],
            ],
            'Woodwind' => [
                ['name' => 'Seruling', 'difficulty' => 'Beginner'],
                ['name' => 'Klarinet', 'difficulty' => 'Intermediate'],
                ['name' => 'Saksofon', 'difficulty' => 'Intermediate'],
            ],
            'Brass' => [
                ['name' => 'Trompet', 'difficulty' => 'Beginner'],
                ['name' => 'Trombon', 'difficulty' => 'Intermediate'],
                ['name' => 'French Horn', 'difficulty' => 'Advanced'],
            ],
            'String' => [
                ['name' => 'Gitar Akustik', 'difficulty' => 'Beginner'],
                ['name' => 'Biola', 'difficulty' => 'Intermediate'],
                ['name' => 'Cello', 'difficulty' => 'Advanced'],
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
