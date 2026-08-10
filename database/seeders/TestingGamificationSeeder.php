<?php

namespace Database\Seeders;

use App\Models\Badge;
use App\Models\Achievement;
use App\Models\Community;
use App\Models\Leaderboard;
use App\Models\MainQuest;
use App\Models\PointLog;
use App\Models\User;
use App\Models\UserAchievement;
use App\Models\UserBadge;
use App\Services\GamificationService;
use Illuminate\Database\Seeder;

/**
 * Jalan PALING TERAKHIR di antara seeder testing lain karena bergantung pada
 * total_xp/total_point akhir yang sudah dimutakhirkan oleh Quiz/Practice/
 * DailyMission/Challenge seeder (semua lewat GamificationService yang sama).
 *
 * Tanggung jawab di sini:
 * 1. Reward XP/Point "Main Quest Selesai" untuk user yang sudah 100% di
 *    kedua material level 1 (dicek dari MaterialProgress).
 * 2. Leaderboard per komunitas x periode (Daily/Weekly/Monthly/Yearly).
 * 3. Pemberian Badge & Achievement secara bertahap (tidak semua user dapat semua).
 */
class TestingGamificationSeeder extends Seeder
{
    public function __construct(protected GamificationService $gamification)
    {
    }

    /**
     * community_name => username yang sudah menuntaskan Main Quest level 1
     * (progress 100% di kedua material level 1, lihat TestingMaterialSeeder).
     *
     * @var array<string, string>
     */
    protected array $questCompleters = [
        'Komunitas Gitar Nusantara' => 'wakil_gitar',
        'Drum Warrior Indonesia' => 'ketua_drum',
        'Violin Harmony' => 'ketua_biola',
    ];

    public function run(): void
    {
        $this->rewardMainQuestCompletion();
        $this->seedLeaderboards();
        $this->seedBadges();
        $this->seedAchievements();
    }

    protected function rewardMainQuestCompletion(): void
    {
        foreach ($this->questCompleters as $communityName => $username) {
            $community = Community::where('community_name', $communityName)->firstOrFail();
            $quest = MainQuest::where('community_id', $community->communities_id)->where('level', 1)->firstOrFail();
            $user = User::where('username', $username)->firstOrFail();

            $alreadyRewarded = PointLog::where('user_id', $user->users_id)
                ->where('reference_type', MainQuest::class)
                ->where('reference_id', $quest->main_quests_id)
                ->exists();

            if ($alreadyRewarded) {
                continue;
            }

            $categoryId = $community->category_id;

            $this->gamification->addXp($user, (int) $quest->xp_reward, $categoryId, "Main Quest: {$quest->title}");
            $this->gamification->addPoint($user, (int) $quest->point_reward, 'Main Quest Completed', MainQuest::class, $quest->main_quests_id);
        }
    }

    protected function seedLeaderboards(): void
    {
        $periods = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

        $communities = Community::with(['members' => fn ($q) => $q->where('status', 'Active')->with('user')])->get();

        foreach ($communities as $community) {
            $rankedUsers = $community->members
                ->pluck('user')
                ->filter()
                ->sortByDesc(fn (User $user) => (int) $user->total_xp)
                ->values();

            foreach ($periods as $period) {
                foreach ($rankedUsers as $index => $user) {
                    Leaderboard::updateOrCreate(
                        ['community_id' => $community->communities_id, 'user_id' => $user->users_id, 'period' => $period],
                        [
                            'total_xp' => $user->total_xp,
                            'total_point' => $user->total_point,
                            'rank' => $index + 1,
                        ]
                    );
                }
            }
        }
    }

    protected function seedBadges(): void
    {
        $badges = Badge::pluck('badges_id', 'badge_name');

        // username => list of badge_name yang sudah didapat
        $plan = [
            'member_gitar' => ['Langkah Pertama'],
            'member_drum' => ['Langkah Pertama', 'Rajin Berlatih'],
            'ketua_gitar' => ['Langkah Pertama', 'Rajin Berlatih', 'Juara Challenge', 'Konduktor'],
            'wakil_gitar' => ['Langkah Pertama', 'Rajin Berlatih'],
            'staff_gitar' => ['Langkah Pertama'],
            'ketua_drum' => ['Langkah Pertama', 'Konduktor'],
            'ketua_biola' => ['Langkah Pertama', 'Konduktor'],
            // user_pemula (Raka) & lainnya sengaja tidak diberi badge -> 0 badge.
        ];

        foreach ($plan as $username => $badgeNames) {
            $user = User::where('username', $username)->firstOrFail();

            foreach ($badgeNames as $index => $badgeName) {
                if (! isset($badges[$badgeName])) {
                    continue;
                }

                UserBadge::updateOrCreate(
                    ['user_id' => $user->users_id, 'badge_id' => $badges[$badgeName]],
                    ['earned_at' => now()->subDays(10 - $index)]
                );
            }
        }
    }

    protected function seedAchievements(): void
    {
        $achievements = Achievement::pluck('achievements_id', 'title');

        // username => list of achievement title yang sudah didapat
        $plan = [
            'user_tempo' => ['Kontributor Forum'],
            'user_chord' => ['Kontributor Forum'],
            'member_drum' => ['Kontributor Forum', 'Konsisten 7 Hari'],
            'ketua_gitar' => ['Penuntas Birama', 'Konsisten 7 Hari', 'Kontributor Forum'],
            'member_gitar' => ['Penuntas Birama', 'Konsisten 7 Hari', 'Kontributor Forum'],
            // user_pemula (Raka) sengaja 0 achievement.
        ];

        foreach ($plan as $username => $titles) {
            $user = User::where('username', $username)->firstOrFail();

            foreach ($titles as $index => $title) {
                if (! isset($achievements[$title])) {
                    continue;
                }

                UserAchievement::updateOrCreate(
                    ['user_id' => $user->users_id, 'achievement_id' => $achievements[$title]],
                    ['achieved_at' => now()->subDays(8 - $index)]
                );
            }
        }
    }
}
