<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\Instrument;
use App\Models\MainQuest;
use App\Models\Material;
use App\Models\MaterialFile;
use App\Models\MaterialProgress;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * 2 material per Main Quest level yang berstatus Published/Draft di
 * TestingQuestSeeder. Komunitas utama (Gitar Nusantara) mendapat konten
 * penuh untuk 7 level; komunitas lain baru diisi untuk level yang sudah
 * mereka kembangkan (level 1-2 saja), meniru pola DemoDataSeeder yang sudah
 * ada di project (hanya level awal yang lengkap, sisanya "shell").
 */
class TestingMaterialSeeder extends Seeder
{
    /**
     * community_name => [short_code, instrument_name, levels_with_material]
     *
     * @var array<string, array{0: string, 1: string, 2: int[]}>
     */
    protected array $communityConfig = [
        'Komunitas Gitar Nusantara' => ['gitar', 'Gitar Akustik', [1, 2, 3, 4, 5, 6, 7]],
        'Drum Warrior Indonesia' => ['drum', 'Drum Set', [1, 2]],
        'Violin Harmony' => ['violin', 'Biola', [1, 2]],
        'Brass Academy' => ['brass', 'Trompet', [1]],
    ];

    public function run(): void
    {
        $communities = Community::whereIn('community_name', array_keys($this->communityConfig))
            ->get()
            ->keyBy('community_name');

        foreach ($this->communityConfig as $communityName => [$code, $instrumentName, $levels]) {
            $community = $communities[$communityName];
            $instrument = Instrument::where('name', $instrumentName)->firstOrFail();

            foreach ($levels as $level) {
                $quest = MainQuest::where('community_id', $community->communities_id)
                    ->where('level', $level)
                    ->firstOrFail();

                $difficulty = match (true) {
                    $level <= 2 => 'Easy',
                    $level <= 5 => 'Medium',
                    default => 'Hard',
                };

                $materialA = Material::updateOrCreate(
                    ['slug' => "{$code}-level-{$level}-video"],
                    [
                        'main_quest_id' => $quest->main_quests_id,
                        'instrument_id' => $instrument->intruments_id,
                        'title' => "Video Pengantar: {$quest->title}",
                        'description' => "Video tutorial dasar untuk materi {$quest->title}.",
                        'difficulty' => $difficulty,
                        'estimated_time' => 10 + ($level * 2),
                        'order_number' => 1,
                        'status' => $quest->status === 'Draft' ? 'Draft' : 'Published',
                    ]
                );

                $materialB = Material::updateOrCreate(
                    ['slug' => "{$code}-level-{$level}-latihan"],
                    [
                        'main_quest_id' => $quest->main_quests_id,
                        'instrument_id' => $instrument->intruments_id,
                        'title' => "Latihan & Evaluasi: {$quest->title}",
                        'description' => "Materi bacaan dan latihan pendukung untuk {$quest->title}.",
                        'difficulty' => $difficulty,
                        'estimated_time' => 15 + ($level * 2),
                        'order_number' => 2,
                        'status' => $quest->status === 'Draft' ? 'Draft' : 'Published',
                    ]
                );

                MaterialFile::updateOrCreate(
                    ['material_id' => $materialA->materials_id, 'file_name' => "{$code}-level-{$level}-video.mp4"],
                    [
                        'file_type' => 'Video',
                        'title' => $materialA->title,
                        'file_path' => "materials/videos/{$code}-level-{$level}-video.mp4",
                        'duration' => 300 + ($level * 30),
                        'file_size' => 25_000_000,
                    ]
                );

                MaterialFile::updateOrCreate(
                    ['material_id' => $materialB->materials_id, 'file_name' => "{$code}-level-{$level}-materi.pdf"],
                    [
                        'file_type' => 'PDF',
                        'title' => $materialB->title,
                        'file_path' => "materials/documents/{$code}-level-{$level}-materi.pdf",
                        'duration' => null,
                        'file_size' => 1_200_000,
                    ]
                );

                // Progress hanya diisi untuk level 1 tiap komunitas, cukup untuk
                // menguji seluruh state progress bar (0/25/50/75/100%).
                if ($level === 1) {
                    $this->seedProgress($communityName, $materialA, $materialB);
                }
            }
        }
    }

    /**
     * @param  Material  $materialA  material pertama (video) di level 1
     * @param  Material  $materialB  material kedua (latihan) di level 1
     */
    protected function seedProgress(string $communityName, Material $materialA, Material $materialB): void
    {
        // username => [progress_A, progress_B|null]
        $progressMap = match ($communityName) {
            'Komunitas Gitar Nusantara' => [
                'user_pemula' => [0, 0],
                'user_tempo' => [25, null],
                'user_chord' => [50, null],
                'member_gitar' => [100, 50],
                'wakil_gitar' => [100, 100],
                'staff_gitar' => [100, 75],
            ],
            'Drum Warrior Indonesia' => [
                'ketua_drum' => [100, 100],
                'member_drum' => [50, null],
                'user_ritme' => [0, null],
            ],
            'Violin Harmony' => [
                'ketua_biola' => [100, 100],
                'member_biola' => [25, null],
            ],
            'Brass Academy' => [
                'ketua_gitar' => [100, 50],
                'member_trompet' => [50, null],
            ],
            default => [],
        };

        $users = User::whereIn('username', array_keys($progressMap))->get()->keyBy('username');

        foreach ($progressMap as $username => [$percentA, $percentB]) {
            $user = $users[$username];

            $this->applyProgress($user, $materialA, $percentA);

            if ($percentB !== null) {
                $this->applyProgress($user, $materialB, $percentB);
            }
        }
    }

    protected function applyProgress(User $user, Material $material, int $percent): void
    {
        $status = match (true) {
            $percent <= 0 => 'Not Started',
            $percent >= 100 => 'Completed',
            default => 'In Progress',
        };

        MaterialProgress::updateOrCreate(
            ['user_id' => $user->users_id, 'material_id' => $material->materials_id],
            [
                'progress_percentage' => $percent,
                'status' => $status,
                'started_at' => $percent > 0 ? now()->subDays(5) : null,
                'completed_at' => $status === 'Completed' ? now()->subDay() : null,
                'last_access_at' => $percent > 0 ? now()->subDay() : null,
            ]
        );
    }
}
