<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\DailyMission;
use App\Models\Material;
use App\Models\Quiz;
use App\Models\User;
use App\Models\UserDailyMission;
use App\Services\GamificationService;
use Illuminate\Database\Seeder;

/**
 * 6 Daily Mission per komunitas (batas maksimal aktif menurut
 * DailyMissionController::store). Reward XP dibuat FIXED (bukan acak) supaya
 * seeder tetap deterministic — berbeda dengan endpoint /complete yang
 * memakai random_int di aplikasi asli.
 */
class TestingDailyMissionSeeder extends Seeder
{
    public function __construct(protected GamificationService $gamification)
    {
    }

    /** @var array<string, string> community_name => material slug (quiz sumber) */
    protected array $quizMaterialSlug = [
        'Komunitas Gitar Nusantara' => 'gitar-level-1-video',
        'Drum Warrior Indonesia' => 'drum-level-1-video',
        'Violin Harmony' => 'violin-level-1-video',
        'Brass Academy' => 'brass-level-1-video',
    ];

    protected array $missionTitles = [
        1 => 'Kuis Harian: Pemanasan',
        2 => 'Kuis Harian: Teori Dasar',
        3 => 'Kuis Harian: Latihan Telinga',
        4 => 'Kuis Harian: Review Materi',
        5 => 'Kuis Harian: Tantangan Kilat',
        6 => 'Kuis Harian: Konsistensi',
    ];

    /**
     * community_name => list of [username, progress, is_completed, reward_claimed]
     * Hanya diisi untuk mission_number = 1 supaya cakupan state cukup tanpa
     * membuat data yang berlebihan.
     */
    protected array $progressPlan = [
        'Komunitas Gitar Nusantara' => [
            ['username' => 'member_gitar', 'progress' => 100, 'completed' => true, 'claimed' => true],
            ['username' => 'wakil_gitar', 'progress' => 100, 'completed' => true, 'claimed' => true],
            ['username' => 'user_tempo', 'progress' => 40, 'completed' => false, 'claimed' => false],
            // user_pemula (Raka) sengaja tidak dibuatkan baris -> state "Not Started".
        ],
        'Drum Warrior Indonesia' => [
            ['username' => 'ketua_drum', 'progress' => 100, 'completed' => true, 'claimed' => true],
            ['username' => 'member_drum', 'progress' => 60, 'completed' => false, 'claimed' => false],
        ],
        'Violin Harmony' => [
            ['username' => 'ketua_biola', 'progress' => 100, 'completed' => true, 'claimed' => true],
        ],
        'Brass Academy' => [
            // Komunitas kecil ini sengaja belum punya progress sama sekali (Not Started semua).
        ],
    ];

    protected const FIXED_XP_REWARD = 15;

    public function run(): void
    {
        $communities = Community::whereIn('community_name', array_keys($this->quizMaterialSlug))
            ->get()
            ->keyBy('community_name');

        foreach ($this->quizMaterialSlug as $communityName => $materialSlug) {
            $community = $communities[$communityName];
            $material = Material::where('slug', $materialSlug)->firstOrFail();
            $quiz = Quiz::where('material_id', $material->materials_id)
                ->where('title', "Quiz: {$material->title}")
                ->firstOrFail();

            $creatorId = $community->owner_id;

            $missions = [];
            foreach ($this->missionTitles as $number => $title) {
                $missions[$number] = DailyMission::updateOrCreate(
                    ['community_id' => $community->communities_id, 'mission_number' => $number],
                    [
                        'created_by' => $creatorId,
                        'quiz_id' => $quiz->quizzes_id,
                        'title' => $title,
                        'description' => 'Kuis singkat harian, reward XP kecil dan tetap.',
                        'xp_reward_min' => 5,
                        'xp_reward_max' => 20,
                        'start_date' => now()->subDays(3)->toDateString(),
                        'end_date' => now()->addDays(7)->toDateString(),
                        'status' => 'Active',
                    ]
                );
            }

            $firstMission = $missions[1];

            foreach ($this->progressPlan[$communityName] as $item) {
                $user = User::where('username', $item['username'])->firstOrFail();

                $userMission = UserDailyMission::updateOrCreate(
                    ['mission_id' => $firstMission->daily_missions_id, 'user_id' => $user->users_id],
                    [
                        'progress' => $item['progress'],
                        'is_completed' => $item['completed'],
                        'reward_claimed' => $item['claimed'],
                        'completed_at' => $item['completed'] ? now()->subDay() : null,
                    ]
                );

                if ($userMission->wasRecentlyCreated && $item['completed'] && $item['claimed']) {
                    $this->gamification->addXp($user, self::FIXED_XP_REWARD, null, "Daily Mission: {$firstMission->title}");
                }
            }
        }
    }
}
