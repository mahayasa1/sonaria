<?php

namespace Database\Seeders;

use App\Models\Material;
use App\Models\Practice;
use App\Models\PracticeReview;
use App\Models\PracticeSubmission;
use App\Models\User;
use App\Services\GamificationService;
use Illuminate\Database\Seeder;

/**
 * Practice + Practice Submission + Practice Review dengan seluruh kondisi
 * status submission (Pending/Approved/Revision/Rejected). Reward XP/Point
 * untuk submission Approved dicairkan lewat GamificationService yang sama
 * dipakai controller aslinya, supaya total_xp/xp_logs/point_logs konsisten.
 */
class TestingPracticeSeeder extends Seeder
{
    public function __construct(protected GamificationService $gamification)
    {
    }

    public function run(): void
    {
        $this->seedGitarPractices();
        $this->seedSimplePractice('drum-level-1-video', 'Latihan Ketukan Dasar', 'Rekam dirimu memainkan pola ketukan dasar selama 30 detik.', 50, 15, [
            ['username' => 'member_drum', 'status' => 'Approved', 'score' => 90, 'reviewer' => 'ketua_drum'],
        ]);
        $this->seedSimplePractice('violin-level-1-video', 'Latihan Bowing Dasar', 'Rekam dirimu memainkan bowing dasar down-up selama 30 detik.', 50, 15, [
            ['username' => 'member_biola', 'status' => 'Pending', 'score' => null, 'reviewer' => null],
        ]);
        $this->seedSimplePractice('brass-level-1-video', 'Latihan Embouchure Dasar', 'Rekam dirimu memainkan nada panjang dengan embouchure yang benar.', 50, 15, [
            ['username' => 'member_trompet', 'status' => 'Approved', 'score' => 85, 'reviewer' => 'ketua_gitar'],
        ]);
    }

    protected function seedGitarPractices(): void
    {
        // Level 1 — Latihan Posisi Jari, 4 kondisi submission sekaligus.
        $this->seedSimplePractice('gitar-level-1-video', 'Latihan Posisi Jari', 'Rekam dirimu memainkan progresi chord dasar selama 30 detik.', 70, 15, [
            ['username' => 'member_gitar', 'status' => 'Approved', 'score' => 92, 'reviewer' => 'staff_gitar'],
            ['username' => 'user_tempo', 'status' => 'Revision', 'score' => 65, 'reviewer' => 'wakil_gitar'],
            ['username' => 'user_chord', 'status' => 'Rejected', 'score' => 40, 'reviewer' => 'ketua_gitar'],
            ['username' => 'staff_gitar', 'status' => 'Pending', 'score' => null, 'reviewer' => null],
        ], minimumScore: 70);

        // Level 2 — Latihan Chord.
        $this->seedSimplePractice('gitar-level-2-video', 'Latihan Chord', 'Rekam perpindahan 3 chord dasar (C, G, Am) selama 1 menit.', 80, 20, [
            ['username' => 'wakil_gitar', 'status' => 'Approved', 'score' => 95, 'reviewer' => 'ketua_gitar'],
            ['username' => 'member_gitar', 'status' => 'Pending', 'score' => null, 'reviewer' => null],
        ], minimumScore: 75);

        // Level 3 — Latihan Perpindahan Chord (sengaja tanpa submission dulu,
        // untuk menguji tampilan practice yang belum ada pengumpulan sama sekali).
        Practice::updateOrCreate(
            ['material_id' => Material::where('slug', 'gitar-level-3-video')->value('materials_id'), 'title' => 'Latihan Perpindahan Chord'],
            [
                'description' => 'Rekam perpindahan chord dengan tempo stabil selama 1 menit.',
                'minimum_score' => 75,
                'xp_reward' => 90,
                'point_reward' => 20,
                'deadline' => now()->addDays(14),
                'status' => 'Active',
            ]
        );

        // Level 4 — Latihan Strumming.
        $this->seedSimplePractice('gitar-level-4-video', 'Latihan Strumming', 'Rekam pola strumming down-up-down selama 1 menit.', 75, 25, [
            ['username' => 'staff_gitar', 'status' => 'Approved', 'score' => 88, 'reviewer' => 'wakil_gitar'],
        ], minimumScore: 75);
    }

    /**
     * @param  array<int, array{username: string, status: string, score: int|null, reviewer: string|null}>  $submissions
     */
    protected function seedSimplePractice(
        string $materialSlug,
        string $title,
        string $description,
        int $xpReward,
        int $pointReward,
        array $submissions,
        int $minimumScore = 70,
    ): void {
        $material = Material::where('slug', $materialSlug)->firstOrFail();

        $practice = Practice::updateOrCreate(
            ['material_id' => $material->materials_id, 'title' => $title],
            [
                'description' => $description,
                'minimum_score' => $minimumScore,
                'xp_reward' => $xpReward,
                'point_reward' => $pointReward,
                'deadline' => now()->addDays(14),
                'status' => 'Active',
            ]
        );

        foreach ($submissions as $index => $item) {
            $user = User::where('username', $item['username'])->firstOrFail();
            $slug = strtolower(str_replace(' ', '-', $item['username']));

            $submission = PracticeSubmission::updateOrCreate(
                ['practice_id' => $practice->practices_id, 'user_id' => $user->users_id],
                [
                    'video_title' => "{$title} - {$user->name}",
                    'video_path' => "practice_submissions/demo/{$slug}-{$practice->practices_id}.mp4",
                    'thumbnail' => "practice_submissions/demo/{$slug}-{$practice->practices_id}.jpg",
                    'duration' => 30 + ($index * 10),
                    'file_size' => 8_000_000,
                    'submitted_at' => now()->subDays(3 + $index),
                    'status' => $item['status'],
                ]
            );

            if ($item['status'] === 'Pending' || $item['reviewer'] === null) {
                continue;
            }

            $reviewer = User::where('username', $item['reviewer'])->firstOrFail();
            $score = $item['score'];

            $review = PracticeReview::updateOrCreate(
                ['submission_id' => $submission->practice_submissions_id],
                [
                    'reviewer_id' => $reviewer->users_id,
                    'score' => $score,
                    'technique_score' => min(100, $score + 2),
                    'rhythm_score' => max(0, $score - 5),
                    'expression_score' => $score,
                    'status' => $item['status'],
                    'feedback' => $item['status'] === 'Approved'
                        ? 'Bagus, teknik sudah rapi dan tempo stabil.'
                        : ($item['status'] === 'Revision'
                            ? 'Perlu latihan lagi di bagian perpindahan chord, ulangi rekaman.'
                            : 'Belum memenuhi standar minimum, coba latihan dasar lagi.'),
                    'reviewed_at' => now()->subDays(2 + $index),
                ]
            );

            if ($review->wasRecentlyCreated && $item['status'] === 'Approved' && $score >= (float) $practice->minimum_score) {
                $categoryId = $material->instrument?->category_id;

                $this->gamification->addXp($user, (int) $practice->xp_reward, $categoryId, "Practice: {$practice->title}");
                $this->gamification->addPoint($user, (int) $practice->point_reward, 'Practice Approved', PracticeSubmission::class, $submission->practice_submissions_id);
            }
        }
    }
}
