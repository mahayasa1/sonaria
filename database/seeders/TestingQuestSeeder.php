<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\MainQuest;
use Illuminate\Database\Seeder;

/**
 * 7 level Main Quest untuk setiap komunitas. XP reward selalu naik sesuai
 * level (aturan bisnis di MainQuestController::store). Status disebar
 * (Draft/Published/Closed) supaya ketiga state bisa diuji.
 */
class TestingQuestSeeder extends Seeder
{
    /**
     * @var array<string, array<int, string>>
     */
    protected array $titlesByCommunity = [
        'Komunitas Gitar Nusantara' => [
            1 => 'Mengenal Gitar dan Senar',
            2 => 'Dasar Chord',
            3 => 'Perpindahan Chord',
            4 => 'Pola Strumming',
            5 => 'Fingerstyle Dasar',
            6 => 'Melodi dan Improvisasi',
            7 => 'Performance Challenge',
        ],
        'Drum Warrior Indonesia' => [
            1 => 'Mengenal Drum Set',
            2 => 'Dasar Ketukan (Beat)',
            3 => 'Fill-in Sederhana',
            4 => 'Groove Berbagai Genre',
            5 => 'Double Pedal Dasar',
            6 => 'Improvisasi Drum',
            7 => 'Performance Challenge',
        ],
        'Violin Harmony' => [
            1 => 'Mengenal Biola dan Bow',
            2 => 'Dasar Bowing',
            3 => 'Posisi Jari Tangan Kiri',
            4 => 'Tangga Nada Dasar',
            5 => 'Vibrato Dasar',
            6 => 'Repertoar Klasik Sederhana',
            7 => 'Performance Challenge',
        ],
        'Brass Academy' => [
            1 => 'Mengenal Alat Tiup Logam',
            2 => 'Dasar Embouchure',
            3 => 'Latihan Pernapasan',
            4 => 'Tangga Nada Dasar',
            5 => 'Artikulasi Dasar',
            6 => 'Repertoar Sederhana',
            7 => 'Performance Challenge',
        ],
    ];

    /**
     * Status per level per komunitas. Gitar Nusantara (komunitas utama)
     * mendapat variasi penuh: Published (1-4), Draft (5-6), Closed (7).
     * Komunitas lain baru mengembangkan level awal saja.
     *
     * @var array<string, array<int, string>>
     */
    protected array $statusByCommunity = [
        'Komunitas Gitar Nusantara' => [1 => 'Published', 2 => 'Published', 3 => 'Published', 4 => 'Published', 5 => 'Draft', 6 => 'Draft', 7 => 'Closed'],
        'Drum Warrior Indonesia' => [1 => 'Published', 2 => 'Published', 3 => 'Draft', 4 => 'Draft', 5 => 'Draft', 6 => 'Draft', 7 => 'Draft'],
        'Violin Harmony' => [1 => 'Published', 2 => 'Published', 3 => 'Draft', 4 => 'Draft', 5 => 'Draft', 6 => 'Draft', 7 => 'Draft'],
        'Brass Academy' => [1 => 'Published', 2 => 'Draft', 3 => 'Draft', 4 => 'Draft', 5 => 'Draft', 6 => 'Draft', 7 => 'Draft'],
    ];

    public function run(): void
    {
        $communities = Community::whereIn('community_name', array_keys($this->titlesByCommunity))
            ->get()
            ->keyBy('community_name');

        foreach ($this->titlesByCommunity as $communityName => $titles) {
            $community = $communities[$communityName];
            $creatorId = $community->owner_id;

            foreach ($titles as $level => $title) {
                MainQuest::updateOrCreate(
                    ['community_id' => $community->communities_id, 'level' => $level],
                    [
                        'created_by' => $creatorId,
                        'title' => $title,
                        'description' => "Birama level {$level}: {$title}.",
                        'xp_reward' => 100 * $level,
                        'point_reward' => 20 * $level,
                        'status' => $this->statusByCommunity[$communityName][$level],
                    ]
                );
            }
        }
    }
}
