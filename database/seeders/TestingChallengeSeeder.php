<?php

namespace Database\Seeders;

use App\Models\Challenge;
use App\Models\ChallengeSubmission;
use App\Models\Community;
use App\Models\Instrument;
use App\Models\User;
use App\Services\GamificationService;
use Illuminate\Database\Seeder;

/**
 * 1 Challenge per komunitas dengan status berbeda (Active/Closed/Draft) dan
 * submission yang mencakup Pending/Approved/Revision/Rejected. Reward XP
 * besar untuk submission Approved dicairkan lewat GamificationService.
 */
class TestingChallengeSeeder extends Seeder
{
    public function __construct(protected GamificationService $gamification)
    {
    }

    public function run(): void
    {
        $gitar = Community::where('community_name', 'Komunitas Gitar Nusantara')->firstOrFail();
        $drum = Community::where('community_name', 'Drum Warrior Indonesia')->firstOrFail();
        $violin = Community::where('community_name', 'Violin Harmony')->firstOrFail();
        $brass = Community::where('community_name', 'Brass Academy')->firstOrFail();

        $gitarInstrument = Instrument::where('name', 'Gitar Akustik')->firstOrFail();
        $drumInstrument = Instrument::where('name', 'Drum Set')->firstOrFail();
        $violinInstrument = Instrument::where('name', 'Biola')->firstOrFail();
        $brassInstrument = Instrument::where('name', 'Trompet')->firstOrFail();

        // 1. Gitar — Active, dengan submission Approved/Pending/Rejected.
        $gitarChallenge = $this->createChallenge($gitar, $gitarInstrument, 'Cover Lagu Daerah Favoritmu', 'Rekam video cover lagu daerah pilihanmu menggunakan gitar.', 100, 30, 'Active');
        $this->createSubmission($gitarChallenge, 'member_gitar', 92, 'Approved', 'ketua_gitar');
        $this->createSubmission($gitarChallenge, 'user_pemula', null, 'Pending', null);
        $this->createSubmission($gitarChallenge, 'user_chord', 55, 'Rejected', 'ketua_gitar');

        // 2. Drum — Active, submission Revision.
        $drumChallenge = $this->createChallenge($drum, $drumInstrument, 'Rhythm Master Challenge', 'Rekam video pola groove drum pilihanmu selama 1 menit.', 150, 40, 'Active');
        $this->createSubmission($drumChallenge, 'member_drum', 78, 'Revision', 'ketua_drum');

        // 3. Violin — Closed, submission Approved (submission dibuat sebelum challenge ditutup).
        $violinChallenge = $this->createChallenge($violin, $violinInstrument, 'Violin Performance Challenge', 'Rekam video penampilan biola solo pilihanmu.', 200, 50, 'Closed');
        $this->createSubmission($violinChallenge, 'member_biola', 95, 'Approved', 'ketua_biola');

        // 4. Brass — Draft, belum dibuka jadi belum ada submission sama sekali.
        $this->createChallenge($brass, $brassInstrument, 'Brass Performance Challenge', 'Rekam video penampilan solo alat tiup logam pilihanmu.', 250, 60, 'Draft');
    }

    protected function createChallenge(Community $community, Instrument $instrument, string $title, string $description, int $xpReward, int $pointReward, string $status): Challenge
    {
        return Challenge::updateOrCreate(
            ['community_id' => $community->communities_id, 'title' => $title],
            [
                'created_by' => $community->owner_id,
                'instrument_id' => $instrument->intruments_id,
                'description' => $description,
                'xp_reward' => $xpReward,
                'point_reward' => $pointReward,
                'start_date' => now()->subDays(5)->toDateString(),
                'end_date' => now()->addDays(25)->toDateString(),
                'status' => $status,
            ]
        );
    }

    protected function createSubmission(Challenge $challenge, string $username, ?int $score, string $status, ?string $reviewerUsername): void
    {
        $user = User::where('username', $username)->firstOrFail();
        $slug = str_replace('_', '-', $username);

        $submission = ChallengeSubmission::updateOrCreate(
            ['challenge_id' => $challenge->challenges_id, 'user_id' => $user->users_id],
            [
                'video_title' => "{$challenge->title} - {$user->name}",
                'video_path' => "challenge_submissions/demo/{$slug}-{$challenge->challenges_id}.mp4",
                'thumbnail' => "challenge_submissions/demo/{$slug}-{$challenge->challenges_id}.jpg",
                'duration' => 60,
                'file_size' => 15_000_000,
                'score' => $score,
                'feedback' => $status === 'Approved'
                    ? 'Penampilan sangat baik, lanjutkan!'
                    : ($status === 'Revision' ? 'Timing perlu diperbaiki, coba rekam ulang.' : ($status === 'Rejected' ? 'Belum memenuhi kriteria challenge.' : null)),
                'status' => $status,
                'reviewed_by' => $reviewerUsername ? User::where('username', $reviewerUsername)->value('users_id') : null,
                'submitted_at' => now()->subDays(3),
                'reviewed_at' => $reviewerUsername ? now()->subDay() : null,
            ]
        );

        if ($submission->wasRecentlyCreated && $status === 'Approved') {
            $categoryId = $challenge->instrument?->category_id;

            $this->gamification->addXp($user, (int) $challenge->xp_reward, $categoryId, "Challenge: {$challenge->title}");
            $this->gamification->addPoint($user, (int) $challenge->point_reward, 'Challenge Approved', ChallengeSubmission::class, $submission->challenge_submissions_id);
        }
    }
}
