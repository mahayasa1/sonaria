<?php

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\ActivityLog;
use App\Models\Badge;
use App\Models\Challenge;
use App\Models\ChallengeSubmission;
use App\Models\Community;
use App\Models\CommunityJoinRequest;
use App\Models\CommunityMember;
use App\Models\CommunityRole;
use App\Models\DailyMission;
use App\Models\DailyMissionOption;
use App\Models\DailyMissionQuestion;
use App\Models\ForumComment;
use App\Models\ForumLike;
use App\Models\ForumPost;
use App\Models\Instrument;
use App\Models\Leaderboard;
use App\Models\Level;
use App\Models\MainQuest;
use App\Models\Material;
use App\Models\MaterialFile;
use App\Models\MaterialProgress;
use App\Models\Notification;
use App\Models\PointLog;
use App\Models\Practice;
use App\Models\PracticeReview;
use App\Models\PracticeSubmission;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizAttempt;
use App\Models\QuizOption;
use App\Models\QuizQuestion;
use App\Models\Role;
use App\Models\User;
use App\Models\UserAchievement;
use App\Models\UserBadge;
use App\Models\UserCategoryPoint;
use App\Models\UserDailyMission;
use App\Models\UserLevelHistory;
use App\Models\UserMainQuestCompletion;
use App\Models\UserProfile;
use App\Models\XpLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Data testing per LEVEL USER.
 *
 * Untuk SETIAP level di tabel levels dibuat 2 akun Member:
 *
 *   lv{N}_tengah  XP di tengah rentang level. Anggota komunitas QA dengan
 *                 progres belajar yang sesuai levelnya (quest di bawah level
 *                 sudah selesai, quest level sekarang sedang dikerjakan).
 *   lv{N}_batas   XP tepat di batas atas level (1 XP lagi naik level, khusus
 *                 level tertinggi dibuat jauh di atas min_xp). Belum punya
 *                 komunitas — Level 1-6 punya join request Pending, Level 7
 *                 bebas untuk menguji alur "Buat Komunitas".
 *
 * Ditambah 1 akun Admin (qa_admin). Seluruh akun berpassword "password" dan
 * emailnya sudah terverifikasi.
 *
 * Peran komunitas pada akun *_tengah mengikuti level: Level 7 = Ketua
 * (pemilik), Level 6 = Wakil Ketua, Level 5 = Staff, Level 1-4 = Member.
 *
 * Seeder ini mandiri (tidak butuh Testing*Seeder lain) tetapi membutuhkan
 * seeder master: Role, Level, MusicCategory, Instrument, CommunityRole,
 * Badge, Achievement. Idempotent: aman dijalankan berulang.
 *
 *   php artisan db:seed --class=LevelTestingSeeder
 */
class LevelTestingSeeder extends Seeder
{
    public const PASSWORD = 'password';

    public const COMMUNITY_NAME = 'Sonaria QA - Uji Per Level';

    public const ADMIN_USERNAME = 'qa_admin';

    protected const QUEST_COUNT = 7;

    /**
     * Kondisi quest yang SEDANG dikerjakan, per level user. Quest di bawah
     * level user selalu tuntas; quest di atasnya belum disentuh.
     *
     * @var array<int, array{progress: int, quiz?: string, practice?: string}>
     */
    protected const CURRENT_QUEST_STATES = [
        1 => ['progress' => 25],
        2 => ['progress' => 100, 'quiz' => 'failed'],
        3 => ['progress' => 100, 'quiz' => 'passed', 'practice' => 'Pending'],
        4 => ['progress' => 100, 'quiz' => 'passed', 'practice' => 'Revision'],
        5 => ['progress' => 100, 'quiz' => 'passed', 'practice' => 'Rejected'],
        6 => ['progress' => 75],
        7 => ['progress' => 0],
    ];

    /**
     * Submission challenge per level: [status, score].
     *
     * @var array<int, array{0: string, 1: int|null}>
     */
    protected const CHALLENGE_PLAN = [
        2 => ['Rejected', 40],
        3 => ['Pending', null],
        4 => ['Revision', 70],
        5 => ['Approved', 100],
        6 => ['Approved', 92],
    ];

    /** @var array<int, string> */
    protected const QUEST_TITLES = [
        1 => 'Mengenal Gitar dan Senar',
        2 => 'Dasar Chord',
        3 => 'Perpindahan Chord',
        4 => 'Pola Strumming',
        5 => 'Fingerstyle Dasar',
        6 => 'Melodi dan Improvisasi',
        7 => 'Performance Challenge',
    ];

    /** @var array<int, array{0: string, 1: string}> */
    protected const CITIES = [
        1 => ['Jakarta', 'DKI Jakarta'],
        2 => ['Bandung', 'Jawa Barat'],
        3 => ['Surabaya', 'Jawa Timur'],
        4 => ['Medan', 'Sumatera Utara'],
        5 => ['Yogyakarta', 'DI Yogyakarta'],
        6 => ['Makassar', 'Sulawesi Selatan'],
        7 => ['Denpasar', 'Bali'],
    ];

    protected string $passwordHash;

    /** @var Collection<int, Level> level number => Level */
    protected Collection $levels;

    protected Role $memberRole;

    protected Role $adminRole;

    protected Instrument $instrument;

    protected Community $community;

    protected User $owner;

    /** @var array<int, User> level number => akun lv{N}_tengah */
    protected array $tengah = [];

    /** @var array<int, User> level number => akun lv{N}_batas */
    protected array $batas = [];

    /** @var array<int, array{quest: MainQuest, material: Material, quiz: Quiz, practice: Practice}> */
    protected array $content = [];

    /** @var array<int, array{xp: int, point: int}> user_id => akumulasi reward per kategori */
    protected array $categoryTotals = [];

    public function run(): void
    {
        DB::transaction(function (): void {
            $this->loadReferences();
            $this->seedUsers();
            $this->seedCommunity();
            $this->seedLearningContent();
            $this->seedLearningProgress();
            $this->seedCategoryPoints();
            $this->seedDailyMissions();
            $this->seedChallenges();
            $this->seedForum();
            $this->seedBadgesAndAchievements();
            $this->seedNotifications();
            $this->seedActivityLogs();
            $this->seedLeaderboards();
        });

        $this->printAccounts();
    }

    protected function loadReferences(): void
    {
        $this->passwordHash = Hash::make(self::PASSWORD);
        $this->levels = Level::all()->sortBy('level')->keyBy('level');
        $this->memberRole = Role::where('role_name', 'Member')->firstOrFail();
        $this->adminRole = Role::where('role_name', 'Admin')->firstOrFail();
        $this->instrument = Instrument::where('name', 'Gitar Akustik')->firstOrFail();
    }

    /**
     * Admin + 2 akun per level, lengkap dengan profil, riwayat level, dan
     * XP log yang konsisten dengan total_xp.
     */
    protected function seedUsers(): void
    {
        $this->upsertUser(
            username: self::ADMIN_USERNAME,
            email: 'admin.qa@sonaria.test',
            name: 'Admin QA Sonaria',
            bio: 'Akun Admin untuk testing panel admin Sonaria.',
            role: $this->adminRole,
            level: $this->levels->first(),
            totalXp: 0,
            totalPoint: 0,
            instrumentId: null,
            index: 0,
        );

        foreach ($this->levels as $number => $level) {
            $this->tengah[$number] = $this->upsertUser(
                username: "lv{$number}_tengah",
                email: "lv{$number}.tengah@sonaria.test",
                name: "Lv{$number} Tengah",
                bio: $this->limit("Akun QA Level {$number} ({$level->title}), XP di tengah rentang level."),
                role: $this->memberRole,
                level: $level,
                totalXp: $this->xpFor($level, 'tengah'),
                totalPoint: $number * 100,
                instrumentId: $this->instrument->intruments_id,
                index: $number,
            );

            $this->batas[$number] = $this->upsertUser(
                username: "lv{$number}_batas",
                email: "lv{$number}.batas@sonaria.test",
                name: "Lv{$number} Batas",
                bio: $this->limit("Akun QA Level {$number} ({$level->title}), XP di batas atas level."),
                role: $this->memberRole,
                level: $level,
                totalXp: $this->xpFor($level, 'batas'),
                totalPoint: $number * 150,
                instrumentId: $this->instrument->intruments_id,
                index: $number,
            );
        }
    }

    protected function upsertUser(
        string $username,
        string $email,
        string $name,
        string $bio,
        Role $role,
        Level $level,
        int $totalXp,
        int $totalPoint,
        ?int $instrumentId,
        int $index,
    ): User {
        $user = User::updateOrCreate(
            ['username' => $username],
            [
                'role_id' => $role->role_id,
                'level_id' => $level->level_id,
                'instrument_id' => $instrumentId,
                'name' => $name,
                'email' => $email,
                'password' => $this->passwordHash,
                'bio' => $bio,
                'total_xp' => $totalXp,
                'total_point' => $totalPoint,
                'status' => 'Active',
            ]
        );

        // email_verified_at tidak ada di $fillable User, jadi harus di-force.
        $user->forceFill(['email_verified_at' => now()])->save();

        [$city, $province] = self::CITIES[$index] ?? self::CITIES[1];

        UserProfile::updateOrCreate(
            ['user_id' => $user->users_id],
            [
                'gender' => $index % 2 === 0 ? 'Female' : 'Male',
                'birth_date' => (1998 + ($index % 6)).'-0'.(1 + ($index % 9)).'-15',
                'phone' => '0821'.str_pad((string) $user->users_id, 8, '0', STR_PAD_LEFT),
                'address' => "Jl. QA Level No. {$index}",
                'province' => $province,
                'city' => $city,
                'profile_completed' => true,
            ]
        );

        $this->resetUserLogs($user);
        $this->seedLevelLogs($user, $level);

        return $user;
    }

    /**
     * Hapus log/riwayat user QA supaya seeder idempotent. Diisi ulang oleh
     * method seed* di bawah.
     */
    protected function resetUserLogs(User $user): void
    {
        $user->xpLogs()->delete();
        $user->levelHistories()->delete();
        $user->pointLogs()->delete();
        $user->categoryPoints()->delete();
        $user->notifications()->delete();
        $user->activityLogs()->delete();
        $user->badges()->delete();
        $user->achievements()->delete();
    }

    /**
     * Riwayat naik level dari Level 1 sampai level user saat ini, ditutup
     * dengan 1 XP log berisi total_xp terkini.
     */
    protected function seedLevelLogs(User $user, Level $level): void
    {
        $reached = $this->levels->filter(fn (Level $item): bool => $item->level <= $level->level)->values();

        foreach ($reached as $index => $reachedLevel) {
            if ($index === 0) {
                continue;
            }

            $previous = $reached[$index - 1];
            $payload = [
                'user_id' => $user->users_id,
                'previous_level' => $previous->level,
                'current_level' => $reachedLevel->level,
                'total_xp' => $reachedLevel->min_xp,
                'level_up_at' => now()->subDays(($reached->count() - $index) * 6)->setTime(10, 0),
            ];

            UserLevelHistory::create($payload);
            XpLog::create($payload);
        }

        XpLog::create([
            'user_id' => $user->users_id,
            'previous_level' => $level->level,
            'current_level' => $level->level,
            'total_xp' => $user->total_xp,
            'level_up_at' => null,
        ]);
    }

    protected function seedCommunity(): void
    {
        $topLevel = (int) $this->levels->keys()->max();
        $this->owner = $this->tengah[min(7, $topLevel)];

        $ketua = CommunityRole::where('role_name', 'Ketua')->firstOrFail();
        $wakil = CommunityRole::where('role_name', 'Wakil Ketua')->firstOrFail();
        $staff = CommunityRole::where('role_name', 'Staff')->firstOrFail();
        $member = CommunityRole::where('role_name', 'Member')->firstOrFail();

        $this->community = Community::updateOrCreate(
            ['community_name' => self::COMMUNITY_NAME],
            [
                'owner_id' => $this->owner->users_id,
                'category_id' => $this->instrument->category_id,
                'instrument_id' => $this->instrument->intruments_id,
                'description' => 'Komunitas khusus QA: berisi anggota dari Level 1 sampai Level 7 untuk menguji fitur per level.',
                'status' => 'Active',
            ]
        );

        foreach ($this->tengah as $number => $user) {
            $role = match ($number) {
                7 => $ketua,
                6 => $wakil,
                5 => $staff,
                default => $member,
            };

            $this->addMember($user, $role, $member, (8 - min($number, 7)) * 4);
        }

        // Akun *_batas Level 1-6: sudah melamar, menunggu persetujuan.
        foreach ($this->batas as $number => $user) {
            if ($number >= 7) {
                continue;
            }

            CommunityJoinRequest::updateOrCreate(
                ['community_id' => $this->community->communities_id, 'user_id' => $user->users_id],
                [
                    'role_id' => $member->community_roles_id,
                    'join_date' => now()->subDays($number),
                    'status' => 'Pending',
                ]
            );
        }

        $this->community->update([
            'total_member' => $this->community->members()->where('status', 'Active')->count(),
        ]);
    }

    protected function addMember(User $user, CommunityRole $role, CommunityRole $memberRole, int $daysAgo): void
    {
        CommunityMember::updateOrCreate(
            ['community_id' => $this->community->communities_id, 'user_id' => $user->users_id],
            [
                'role_id' => $role->community_roles_id,
                'join_date' => now()->subDays($daysAgo),
                'status' => 'Active',
            ]
        );

        if ($role->role_name !== 'Ketua') {
            CommunityJoinRequest::updateOrCreate(
                ['community_id' => $this->community->communities_id, 'user_id' => $user->users_id],
                [
                    'role_id' => $memberRole->community_roles_id,
                    'join_date' => now()->subDays($daysAgo),
                    'status' => 'Active',
                ]
            );
        }
    }

    /**
     * 7 Main Quest (Published), masing-masing 1 material + 1 quiz (5 soal) +
     * 1 practice, supaya seluruh level punya konten yang bisa dikerjakan.
     */
    protected function seedLearningContent(): void
    {
        for ($number = 1; $number <= self::QUEST_COUNT; $number++) {
            $title = self::QUEST_TITLES[$number];

            $quest = MainQuest::updateOrCreate(
                ['community_id' => $this->community->communities_id, 'level' => $number],
                [
                    'created_by' => $this->owner->users_id,
                    'title' => $title,
                    'description' => "Birama level {$number}: {$title}.",
                    'xp_reward' => 100 * $number,
                    'point_reward' => 20 * $number,
                    'status' => 'Published',
                ]
            );

            $material = Material::updateOrCreate(
                ['slug' => "qa-level-{$number}-materi"],
                [
                    'main_quest_id' => $quest->main_quests_id,
                    'instrument_id' => $this->instrument->intruments_id,
                    'title' => "Materi QA Level {$number}: {$title}",
                    'description' => "Materi pengantar untuk {$title}.",
                    'difficulty' => match (true) {
                        $number <= 2 => 'Easy',
                        $number <= 5 => 'Medium',
                        default => 'Hard',
                    },
                    'estimated_time' => 10 + ($number * 2),
                    'order_number' => 1,
                    'status' => 'Published',
                ]
            );

            MaterialFile::updateOrCreate(
                ['material_id' => $material->materials_id, 'file_name' => "qa-level-{$number}-video.mp4"],
                [
                    'file_type' => 'Video',
                    'title' => $material->title,
                    'file_path' => "materials/videos/qa-level-{$number}-video.mp4",
                    'duration' => 300 + ($number * 30),
                    'file_size' => 25_000_000,
                ]
            );

            $quiz = $this->seedQuiz($material, $number);

            $practice = Practice::updateOrCreate(
                ['material_id' => $material->materials_id, 'title' => "Latihan QA Level {$number}"],
                [
                    'description' => "Rekam dirimu memainkan latihan {$title} selama 30 detik.",
                    'minimum_score' => 70,
                    'xp_reward' => 50,
                    'point_reward' => 15,
                    'deadline' => now()->addDays(14),
                    'status' => 'Active',
                ]
            );

            $this->content[$number] = [
                'quest' => $quest,
                'material' => $material,
                'quiz' => $quiz,
                'practice' => $practice,
            ];
        }
    }

    protected function seedQuiz(Material $material, int $number): Quiz
    {
        $quiz = Quiz::updateOrCreate(
            ['material_id' => $material->materials_id, 'title' => "Quiz QA Level {$number}"],
            [
                'description' => "Uji pemahamanmu tentang {$material->title}.",
                'total_questions' => 5,
                'duration' => 5,
                'passing_score' => 70,
                'xp_reward' => 30,
                'point_reward' => 5,
                'status' => 'Published',
            ]
        );

        for ($questionNumber = 1; $questionNumber <= 5; $questionNumber++) {
            $question = QuizQuestion::updateOrCreate(
                ['quiz_id' => $quiz->quizzes_id, 'order_number' => $questionNumber],
                [
                    'question' => "Level {$number} - Soal {$questionNumber}: manakah pernyataan yang paling tepat tentang \"".self::QUEST_TITLES[$number].'"?',
                    'question_type' => 'Multiple Choice',
                    'score' => 20,
                ]
            );

            $correctIndex = ($questionNumber + $number) % 4;

            foreach (['A', 'B', 'C', 'D'] as $index => $label) {
                QuizOption::updateOrCreate(
                    ['question_id' => $question->quiz_questions_id, 'option_label' => $label],
                    [
                        'option_text' => $index === $correctIndex
                            ? "Jawaban benar soal {$questionNumber}"
                            : "Pilihan pengecoh {$label} soal {$questionNumber}",
                        'is_correct' => $index === $correctIndex,
                    ]
                );
            }
        }

        return $quiz;
    }

    /**
     * Progres belajar akun *_tengah: quest di bawah level user tuntas,
     * quest level user sesuai CURRENT_QUEST_STATES, sisanya belum disentuh.
     */
    protected function seedLearningProgress(): void
    {
        foreach ($this->tengah as $number => $user) {
            $currentQuest = min($number, self::QUEST_COUNT);
            $allDone = $number > self::QUEST_COUNT;

            for ($questNumber = 1; $questNumber <= self::QUEST_COUNT; $questNumber++) {
                if ($allDone || $questNumber < $currentQuest) {
                    $this->completeQuest($user, $questNumber, $number);

                    continue;
                }

                if ($questNumber === $currentQuest) {
                    $this->applyCurrentQuestState($user, $questNumber);
                }
            }
        }
    }

    protected function completeQuest(User $user, int $questNumber, int $userLevel): void
    {
        ['quest' => $quest, 'material' => $material, 'quiz' => $quiz, 'practice' => $practice] = $this->content[$questNumber];
        $daysAgo = max(1, ($userLevel - $questNumber) * 4);

        $this->saveProgress($user, $material, 100, now()->subDays($daysAgo + 2), now()->subDays($daysAgo));
        $this->saveQuizAttempt($user, $quiz, 5, now()->subDays($daysAgo));
        $this->recordQuizReward($user, $quiz);
        $this->savePracticeSubmission($user, $practice, 'Approved', 90, $daysAgo);

        UserMainQuestCompletion::updateOrCreate(
            ['user_id' => $user->users_id, 'main_quest_id' => $quest->main_quests_id],
            ['completed_at' => now()->subDays($daysAgo)]
        );

        $this->addLog($user, 'Main Quest Completed', MainQuest::class, $quest->main_quests_id, (int) $quest->point_reward, "Main Quest: {$quest->title}", (int) $quest->xp_reward);
    }

    protected function applyCurrentQuestState(User $user, int $questNumber): void
    {
        $state = self::CURRENT_QUEST_STATES[$questNumber];
        ['material' => $material, 'quiz' => $quiz, 'practice' => $practice] = $this->content[$questNumber];

        $progress = $state['progress'];

        $this->saveProgress(
            $user,
            $material,
            $progress,
            $progress > 0 ? now()->subDays(3) : null,
            $progress >= 100 ? now()->subDay() : null,
        );

        match ($state['quiz'] ?? null) {
            'failed' => $this->saveQuizAttempt($user, $quiz, 2, now()->subDay()),
            'passed' => $this->passQuiz($user, $quiz),
            default => null,
        };

        if (isset($state['practice'])) {
            $score = match ($state['practice']) {
                'Revision' => 60,
                'Rejected' => 35,
                default => null,
            };

            $this->savePracticeSubmission($user, $practice, $state['practice'], $score, 1);
        }
    }

    protected function passQuiz(User $user, Quiz $quiz): void
    {
        $this->saveQuizAttempt($user, $quiz, 5, now()->subDay());
        $this->recordQuizReward($user, $quiz);
    }

    protected function saveProgress(User $user, Material $material, int $percent, mixed $startedAt, mixed $completedAt): void
    {
        MaterialProgress::updateOrCreate(
            ['user_id' => $user->users_id, 'material_id' => $material->materials_id],
            [
                'progress_percentage' => $percent,
                'status' => match (true) {
                    $percent <= 0 => 'Not Started',
                    $percent >= 100 => 'Completed',
                    default => 'In Progress',
                },
                'started_at' => $startedAt,
                'completed_at' => $completedAt,
                'last_access_at' => $startedAt ? now()->subHours(6) : null,
            ]
        );
    }

    protected function saveQuizAttempt(User $user, Quiz $quiz, int $correctCount, mixed $startedAt): void
    {
        $attempt = QuizAttempt::updateOrCreate(
            ['quiz_id' => $quiz->quizzes_id, 'user_id' => $user->users_id],
            [
                'score' => $correctCount * 20,
                'total_correct' => $correctCount,
                'total_wrong' => 5 - $correctCount,
                'is_passed' => ($correctCount * 20) >= (float) $quiz->passing_score,
                'started_at' => $startedAt,
                'finished_at' => (clone $startedAt)->addMinutes(5),
                'duration' => 300,
            ]
        );

        $attempt->answers()->delete();

        $questions = $quiz->questions()->with('options')->orderBy('order_number')->get();

        foreach ($questions as $index => $question) {
            $isCorrect = $index < $correctCount;
            $option = $isCorrect
                ? $question->options->firstWhere('is_correct', true)
                : $question->options->firstWhere('is_correct', false);

            QuizAnswer::create([
                'attempt_id' => $attempt->quiz_attempts_id,
                'question_id' => $question->quiz_questions_id,
                'option_id' => $option?->quiz_options_id,
                'is_correct' => $isCorrect,
                'score' => $isCorrect ? $question->score : 0,
                'answered_at' => $startedAt,
            ]);
        }
    }

    protected function recordQuizReward(User $user, Quiz $quiz): void
    {
        $this->addLog($user, 'Quiz Passed', Quiz::class, $quiz->quizzes_id, (int) $quiz->point_reward, "Quiz: {$quiz->title}", (int) $quiz->xp_reward);
    }

    protected function savePracticeSubmission(User $user, Practice $practice, string $status, ?int $score, int $daysAgo): void
    {
        $slug = str_replace('_', '-', $user->username);

        $submission = PracticeSubmission::updateOrCreate(
            ['practice_id' => $practice->practices_id, 'user_id' => $user->users_id],
            [
                'video_title' => "{$practice->title} - {$user->name}",
                'video_path' => "practice_submissions/qa/{$slug}-{$practice->practices_id}.mp4",
                'thumbnail' => "practice_submissions/qa/{$slug}-{$practice->practices_id}.jpg",
                'duration' => 30,
                'file_size' => 8_000_000,
                'submitted_at' => now()->subDays($daysAgo + 1),
                'status' => $status,
            ]
        );

        if ($status === 'Pending' || $score === null) {
            return;
        }

        // Ketua tidak mereview submission miliknya sendiri; diganti Wakil Ketua.
        $reviewer = $user->users_id === $this->owner->users_id
            ? ($this->tengah[6] ?? $this->owner)
            : $this->owner;

        PracticeReview::updateOrCreate(
            ['submission_id' => $submission->practice_submissions_id],
            [
                'reviewer_id' => $reviewer->users_id,
                'score' => $score,
                'technique_score' => min(100, $score + 2),
                'rhythm_score' => max(0, $score - 5),
                'expression_score' => $score,
                'status' => $status,
                'feedback' => match ($status) {
                    'Approved' => 'Bagus, teknik sudah rapi dan tempo stabil.',
                    'Revision' => 'Perlu latihan lagi di bagian perpindahan chord, ulangi rekaman.',
                    default => 'Belum memenuhi standar minimum, coba latihan dasar lagi.',
                },
                'reviewed_at' => now()->subDays($daysAgo),
            ]
        );

        if ($status === 'Approved') {
            $this->addLog($user, 'Practice Approved', PracticeSubmission::class, $submission->practice_submissions_id, (int) $practice->point_reward, "Practice: {$practice->title}", (int) $practice->xp_reward);
        }
    }

    /**
     * Catat PointLog dan akumulasikan reward untuk user_category_points.
     */
    protected function addLog(User $user, string $activity, string $referenceType, int $referenceId, int $point, string $description, int $xp): void
    {
        PointLog::create([
            'user_id' => $user->users_id,
            'activity' => $activity,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'point' => $point,
            'description' => $this->limit($description),
        ]);

        $this->categoryTotals[$user->users_id]['xp'] = ($this->categoryTotals[$user->users_id]['xp'] ?? 0) + $xp;
        $this->categoryTotals[$user->users_id]['point'] = ($this->categoryTotals[$user->users_id]['point'] ?? 0) + $point;
    }

    protected function seedCategoryPoints(): void
    {
        foreach ($this->categoryTotals as $userId => $totals) {
            UserCategoryPoint::create([
                'user_id' => $userId,
                'category_id' => $this->instrument->category_id,
                'total_xp' => $totals['xp'],
                'total_point' => $totals['point'],
            ]);
        }
    }

    /**
     * 3 Daily Mission aktif (2 soal pilihan ganda per misi). Progres hari ini
     * makin banyak seiring level: L1 sedang berjalan (50%), L2 selesai tapi
     * belum diklaim, L3+ selesai & diklaim sebanyak (level - 2) misi.
     */
    protected function seedDailyMissions(): void
    {
        $missions = [];

        for ($number = 1; $number <= 3; $number++) {
            $mission = DailyMission::updateOrCreate(
                ['community_id' => $this->community->communities_id, 'mission_number' => $number],
                [
                    'created_by' => $this->owner->users_id,
                    'title' => "Kuis Harian QA #{$number}",
                    'description' => 'Kuis singkat harian untuk testing, reward XP kecil.',
                    'passing_score' => 100,
                    'xp_reward_min' => 5,
                    'xp_reward_max' => 20,
                    'start_date' => now()->subDays(3)->toDateString(),
                    'end_date' => now()->addDays(7)->toDateString(),
                    'status' => 'Active',
                ]
            );

            for ($questionNumber = 1; $questionNumber <= 2; $questionNumber++) {
                $question = DailyMissionQuestion::updateOrCreate(
                    ['daily_mission_id' => $mission->daily_missions_id, 'order_number' => $questionNumber],
                    ['question' => "Kuis harian #{$number} - pertanyaan {$questionNumber}: pilih jawaban yang benar."]
                );

                foreach (['A', 'B', 'C'] as $index => $label) {
                    DailyMissionOption::updateOrCreate(
                        ['question_id' => $question->daily_mission_questions_id, 'option_label' => $label],
                        [
                            'option_text' => $index === 0 ? 'Jawaban benar' : "Pilihan pengecoh {$label}",
                            'is_correct' => $index === 0,
                        ]
                    );
                }
            }

            $missions[$number] = $mission;
        }

        foreach ($this->tengah as $level => $user) {
            foreach ($missions as $number => $mission) {
                $state = match (true) {
                    $level === 1 && $number === 1 => ['progress' => 50, 'completed' => false, 'claimed' => false],
                    $level === 2 && $number === 1 => ['progress' => 100, 'completed' => true, 'claimed' => false],
                    $number <= $level - 2 => ['progress' => 100, 'completed' => true, 'claimed' => true],
                    default => null,
                };

                if ($state === null) {
                    continue;
                }

                UserDailyMission::updateOrCreate(
                    ['mission_id' => $mission->daily_missions_id, 'user_id' => $user->users_id, 'mission_date' => now()->toDateString()],
                    [
                        'progress' => $state['progress'],
                        'is_completed' => $state['completed'],
                        'reward_claimed' => $state['claimed'],
                        'completed_at' => $state['completed'] ? now()->subHours(2) : null,
                    ]
                );
            }
        }
    }

    /**
     * 1 challenge Active (dengan submission berbagai status) + 1 Closed.
     */
    protected function seedChallenges(): void
    {
        $active = $this->upsertChallenge('Cover Lagu Favorit (QA)', 'Rekam video cover lagu favoritmu dengan gitar.', 100, 30, 'Active');
        $this->upsertChallenge('Challenge Bulan Lalu (QA)', 'Challenge yang sudah ditutup, tidak menerima submission baru.', 80, 20, 'Closed');

        foreach (self::CHALLENGE_PLAN as $level => [$status, $score]) {
            $user = $this->tengah[$level] ?? null;

            if (! $user) {
                continue;
            }

            $slug = str_replace('_', '-', $user->username);
            $reviewed = $status !== 'Pending';

            $submission = ChallengeSubmission::updateOrCreate(
                ['challenge_id' => $active->challenges_id, 'user_id' => $user->users_id],
                [
                    'video_title' => "{$active->title} - {$user->name}",
                    'video_path' => "challenge_submissions/qa/{$slug}-{$active->challenges_id}.mp4",
                    'thumbnail' => "challenge_submissions/qa/{$slug}-{$active->challenges_id}.jpg",
                    'duration' => 60,
                    'file_size' => 15_000_000,
                    'score' => $score,
                    'feedback' => match ($status) {
                        'Approved' => 'Penampilan sangat baik, lanjutkan!',
                        'Revision' => 'Timing perlu diperbaiki, coba rekam ulang.',
                        'Rejected' => 'Belum memenuhi kriteria challenge.',
                        default => null,
                    },
                    'status' => $status,
                    'reviewed_by' => $reviewed ? $this->owner->users_id : null,
                    'submitted_at' => now()->subDays(3),
                    'reviewed_at' => $reviewed ? now()->subDay() : null,
                ]
            );

            if ($status === 'Approved') {
                $this->addLog($user, 'Challenge Approved', ChallengeSubmission::class, $submission->challenge_submissions_id, (int) $active->point_reward, "Challenge: {$active->title}", (int) $active->xp_reward);
            }
        }
    }

    protected function upsertChallenge(string $title, string $description, int $xp, int $point, string $status): Challenge
    {
        return Challenge::updateOrCreate(
            ['community_id' => $this->community->communities_id, 'title' => $title],
            [
                'created_by' => $this->owner->users_id,
                'instrument_id' => $this->instrument->intruments_id,
                'description' => $description,
                'xp_reward' => $xp,
                'point_reward' => $point,
                'start_date' => now()->subDays($status === 'Closed' ? 40 : 5)->toDateString(),
                'end_date' => $status === 'Closed' ? now()->subDays(10)->toDateString() : now()->addDays(25)->toDateString(),
                'status' => $status,
            ]
        );
    }

    /**
     * 1 post per anggota (satu per level) + 1 post Hidden milik Staff untuk
     * menguji moderasi. Like dan komentar tersebar lintas level.
     */
    protected function seedForum(): void
    {
        $posts = [];

        foreach ($this->tengah as $level => $user) {
            $posts[$level] = ForumPost::updateOrCreate(
                ['community_id' => $this->community->communities_id, 'user_id' => $user->users_id, 'title' => "Halo dari Level {$level}"],
                [
                    'content' => "Salam kenal, aku {$user->name} dari Level {$level}. Ada tips latihan untuk level ini?",
                    'status' => 'Published',
                ]
            );
        }

        if (isset($this->tengah[5])) {
            ForumPost::updateOrCreate(
                ['community_id' => $this->community->communities_id, 'user_id' => $this->tengah[5]->users_id, 'title' => 'Postingan disembunyikan (QA)'],
                [
                    'content' => 'Post ini berstatus Hidden untuk menguji moderasi forum.',
                    'status' => 'Hidden',
                ]
            );
        }

        foreach ($posts as $postLevel => $post) {
            foreach ($this->tengah as $likerLevel => $liker) {
                if ($likerLevel !== $postLevel && ($likerLevel + $postLevel) % 2 === 0) {
                    ForumLike::updateOrCreate(['post_id' => $post->forum_posts_id, 'user_id' => $liker->users_id]);
                }
            }

            $commenterLevel = isset($this->tengah[$postLevel + 1]) ? $postLevel + 1 : 1;
            $commenter = $this->tengah[$commenterLevel] ?? null;

            if (! $commenter || $commenterLevel === $postLevel) {
                continue;
            }

            $comment = ForumComment::updateOrCreate(
                ['post_id' => $post->forum_posts_id, 'user_id' => $commenter->users_id, 'comment' => 'Semangat! Latihan rutin 15 menit sehari sudah cukup membantu.'],
                ['parent_id' => null, 'status' => 'Active']
            );

            if ($postLevel < 7) {
                ForumComment::updateOrCreate(
                    ['post_id' => $post->forum_posts_id, 'user_id' => $this->tengah[$postLevel]->users_id, 'comment' => 'Makasih sarannya, aku coba!'],
                    ['parent_id' => $comment->forum_comments_id, 'status' => 'Active']
                );
            }
        }

        foreach ($posts as $post) {
            $post->update([
                'total_like' => ForumLike::where('post_id', $post->forum_posts_id)->count(),
                'total_comment' => ForumComment::where('post_id', $post->forum_posts_id)->where('status', 'Active')->count(),
            ]);
        }
    }

    /**
     * Badge & achievement bertahap menurut level akun *_tengah (Level 1 = 0).
     */
    protected function seedBadgesAndAchievements(): void
    {
        $badgePlan = [
            'Langkah Pertama' => fn (int $level): bool => $level >= 2,
            'Rajin Berlatih' => fn (int $level): bool => $level >= 3,
            'Juara Challenge' => fn (int $level): bool => $level >= 5,
            'Konduktor' => fn (int $level): bool => $level >= 7,
        ];

        $achievementPlan = [
            'Konsisten 7 Hari' => fn (int $level): bool => $level >= 4,
            'Kontributor Forum' => fn (int $level): bool => $level >= 6,
        ];

        $badges = Badge::pluck('badges_id', 'badge_name');
        $achievements = Achievement::pluck('achievements_id', 'title');

        foreach ($this->levels as $level => $_) {
            foreach ([$this->tengah[$level], $this->batas[$level]] as $user) {
                $isBatas = $user->username === "lv{$level}_batas";

                foreach ($badgePlan as $name => $rule) {
                    // Akun batas tidak punya progres belajar, hanya badge berbasis XP.
                    if (! isset($badges[$name]) || ! $rule($level) || ($isBatas && $name !== 'Konduktor')) {
                        continue;
                    }

                    UserBadge::create([
                        'user_id' => $user->users_id,
                        'badge_id' => $badges[$name],
                        'earned_at' => now()->subDays(max(1, 10 - $level)),
                    ]);
                }

                if ($isBatas) {
                    continue;
                }

                foreach ($achievementPlan as $title => $rule) {
                    if (! isset($achievements[$title]) || ! $rule($level)) {
                        continue;
                    }

                    UserAchievement::create([
                        'user_id' => $user->users_id,
                        'achievement_id' => $achievements[$title],
                        'achieved_at' => now()->subDays(max(1, 8 - $level)),
                    ]);
                }
            }
        }
    }

    protected function seedNotifications(): void
    {
        foreach ($this->levels as $number => $level) {
            $tengah = $this->tengah[$number];
            $batas = $this->batas[$number];

            $this->notify($tengah, 'System', 'Selamat datang di Sonaria', "Akun QA Level {$number} siap diuji.", true);

            if ($number >= 2) {
                $this->notify($tengah, 'System', 'Naik level!', "Selamat, kamu naik ke Level {$number} — {$level->title}.", true);
            }

            $this->notify($tengah, 'Main Quest', "Main Quest level {$number} sedang berjalan", 'Lanjutkan materi, quiz, dan practice untuk menuntaskannya.', false);

            match ($number) {
                3 => $this->notify($tengah, 'Practice', 'Practice menunggu review', 'Practice kamu sudah diterima dan menunggu direview.', false),
                4 => $this->notify($tengah, 'Practice', 'Practice perlu revisi', 'Reviewer meminta kamu merekam ulang practice ini.', false),
                5 => $this->notify($tengah, 'Practice', 'Practice ditolak', 'Practice kamu belum memenuhi standar minimum.', false),
                default => null,
            };

            if (isset(self::CHALLENGE_PLAN[$number])) {
                $this->notify($tengah, 'Challenge', 'Update submission challenge', 'Status submission challenge kamu: '.self::CHALLENGE_PLAN[$number][0].'.', false);
            }

            if ($number >= 5) {
                $this->notify($tengah, 'Practice', 'Submission baru menunggu review', 'Ada practice dari anggota komunitas yang perlu kamu review.', false);
            }

            $this->notify($batas, 'System', 'Akun QA siap diuji', "Akun Level {$number} dengan total XP {$batas->total_xp}.", true);

            if ($number < 7) {
                $this->notify($batas, 'System', 'Permintaan bergabung dikirim', 'Permintaan bergabung ke komunitas QA sedang menunggu persetujuan.', false);
            } else {
                $this->notify($batas, 'System', 'Kamu bisa membuat komunitas', 'Level 7 membuka fitur membuat komunitas sendiri.', false);
            }
        }
    }

    protected function notify(User $user, string $type, string $title, string $message, bool $read): void
    {
        Notification::create([
            'user_id' => $user->users_id,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'is_read' => $read,
            'read_at' => $read ? now()->subHours(3) : null,
        ]);
    }

    protected function seedActivityLogs(): void
    {
        $users = array_merge(array_values($this->tengah), array_values($this->batas), [User::where('username', self::ADMIN_USERNAME)->firstOrFail()]);

        foreach ($users as $user) {
            foreach ([['Login', 'Auth', 'User berhasil login.'], ['Membuka dashboard', 'Dashboard', 'User membuka halaman dashboard.']] as [$activity, $module, $description]) {
                ActivityLog::create([
                    'user_id' => $user->users_id,
                    'activity' => $activity,
                    'module' => $module,
                    'description' => $description,
                    'ip_address' => '127.0.0.1',
                    'device' => 'Desktop',
                    'browser' => 'Chrome',
                    'operating_system' => 'Windows 11',
                ]);
            }
        }
    }

    protected function seedLeaderboards(): void
    {
        $ranked = $this->community->members()
            ->where('status', 'Active')
            ->with('user')
            ->get()
            ->pluck('user')
            ->filter()
            ->sortByDesc(fn (User $user): int => (int) $user->total_xp)
            ->values();

        foreach (['Daily', 'Weekly', 'Monthly', 'Yearly'] as $period) {
            foreach ($ranked as $index => $user) {
                Leaderboard::updateOrCreate(
                    ['community_id' => $this->community->communities_id, 'user_id' => $user->users_id, 'period' => $period],
                    [
                        'total_xp' => $user->total_xp,
                        'total_point' => $user->total_point,
                        'rank' => $index + 1,
                    ]
                );
            }
        }
    }

    /**
     * XP akun per level: "tengah" = titik tengah rentang, "batas" = max_xp
     * (level tertinggi tidak punya batas atas nyata, jadi dibuat min_xp + 4000).
     */
    protected function xpFor(Level $level, string $variant): int
    {
        $min = (int) $level->min_xp;
        $max = (int) $level->max_xp;
        $isTopLevel = $level->level === (int) $this->levels->keys()->max();

        return match (true) {
            $variant === 'tengah' && $isTopLevel => $min + 2000,
            $variant === 'tengah' => intdiv($min + $max, 2),
            $isTopLevel => $min + 4000,
            default => $max,
        };
    }

    protected function limit(string $text, int $length = 100): string
    {
        return mb_substr($text, 0, $length);
    }

    protected function printAccounts(): void
    {
        if (! $this->command) {
            return;
        }

        $rows = [['Admin', '-', self::ADMIN_USERNAME, 'admin.qa@sonaria.test', 0, 'Admin']];

        foreach ($this->levels as $number => $level) {
            foreach ([$this->tengah[$number], $this->batas[$number]] as $user) {
                $rows[] = [
                    $number,
                    $level->title,
                    $user->username,
                    $user->email,
                    $user->total_xp,
                    $this->describeState($user, $number),
                ];
            }
        }

        $this->command->info('Akun QA per level (password: '.self::PASSWORD.')');
        $this->command->table(['Level', 'Judul', 'Username', 'Email', 'XP', 'Kondisi'], $rows);
    }

    protected function describeState(User $user, int $number): string
    {
        if ($user->username === "lv{$number}_batas") {
            return $number >= 7 ? 'Tanpa komunitas, bisa buat komunitas' : 'Join request Pending';
        }

        return match ($number) {
            7 => 'Ketua QA',
            6 => 'Wakil Ketua QA',
            5 => 'Staff QA',
            default => 'Member QA',
        };
    }
}