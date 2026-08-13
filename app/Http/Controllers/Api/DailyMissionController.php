<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\DailyMission;
use App\Models\UserDailyMission;
use App\Services\GamificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DailyMissionController extends Controller
{
    public function __construct(protected GamificationService $gamification)
    {
    }

    /**
     * 6 daily mission komunitas untuk hari ini beserta progress user HARI INI
     * (mission_date = hari ini). Progress kemarin tidak dibawa-bawa, jadi
     * setiap hari misi otomatis "reset" tanpa perlu job terjadwal.
     */
    public function index(Request $request, Community $community): JsonResponse
    {
        $user = $request->user();
        $today = now()->toDateString();

        $missions = $community->dailyMissions()
            ->where('status', 'Active')
            ->whereDate('start_date', '<=', $today)
            ->whereDate('end_date', '>=', $today)
            ->orderBy('mission_number')
            ->withCount('questions')
            ->get()
            ->map(function (DailyMission $mission) use ($user, $today) {
                $mission->setRelation(
                    'my_progress',
                    UserDailyMission::where('mission_id', $mission->daily_missions_id)
                        ->where('user_id', $user->users_id)
                        ->whereDate('mission_date', $today)
                        ->first()
                );

                return $mission;
            });

        return response()->json($missions);
    }

    /**
     * Buat daily mission baru (khusus Ketua/Wakil Ketua). Maksimal 6 per
     * komunitas per periode aktif. Sekarang soalnya dibuat langsung di sini
     * (question builder sendiri) — tidak lagi butuh Quiz Main Quest yang
     * sudah ada duluan.
     */
    public function store(Request $request, Community $community): JsonResponse
    {
        $this->authorize('manage', $community);

        $activeCount = $community->dailyMissions()->where('status', 'Active')->count();
        if ($activeCount >= 6) {
            throw ValidationException::withMessages([
                'mission_number' => ['Komunitas ini sudah punya 6 daily mission aktif.'],
            ]);
        }

        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:255'],
            'passing_score' => ['nullable', 'integer', 'min:1', 'max:100'],
            'mission_number' => ['required', 'integer', 'min:1', 'max:6'],
            'xp_reward_min' => ['required', 'integer', 'min:1'],
            'xp_reward_max' => ['required', 'integer', 'gte:xp_reward_min'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.question' => ['required', 'string'],
            'questions.*.options' => ['required', 'array', 'min:2'],
            'questions.*.options.*.option_label' => ['required', 'string', 'max:10'],
            'questions.*.options.*.option_text' => ['required', 'string', 'max:255'],
            'questions.*.options.*.is_correct' => ['required', 'boolean'],
        ]);

        foreach ($data['questions'] as $i => $question) {
            $correctCount = collect($question['options'])->where('is_correct', true)->count();
            if ($correctCount !== 1) {
                throw ValidationException::withMessages([
                    "questions.{$i}.options" => ['Setiap pertanyaan harus punya tepat satu jawaban benar.'],
                ]);
            }
        }

        $mission = DB::transaction(function () use ($data, $community, $request) {
            $mission = $community->dailyMissions()->create([
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'passing_score' => $data['passing_score'] ?? 100,
                'mission_number' => $data['mission_number'],
                'xp_reward_min' => $data['xp_reward_min'],
                'xp_reward_max' => $data['xp_reward_max'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'created_by' => $request->user()->users_id,
                'status' => 'Active',
            ]);

            foreach ($data['questions'] as $order => $question) {
                $missionQuestion = $mission->questions()->create([
                    'question' => $question['question'],
                    'order_number' => $order + 1,
                ]);

                foreach ($question['options'] as $option) {
                    $missionQuestion->options()->create($option);
                }
            }

            return $mission;
        });

        return response()->json($mission->load('questions.options'), 201);
    }

    /**
     * Detail mission + soal & opsi TANPA is_correct, untuk dikerjakan user.
     */
    public function show(DailyMission $mission): JsonResponse
    {
        $mission->load(['questions' => fn ($q) => $q->orderBy('order_number')]);
        $mission->load(['questions.options' => function ($query) {
            $query->select('daily_mission_options_id', 'question_id', 'option_label', 'option_text');
        }]);

        return response()->json($mission);
    }

    /**
     * Submit jawaban & tandai mission selesai HARI INI kalau skor >= passing_score.
     * Reward XP acak (kecil) dicairkan sekali per hari per mission.
     */
    public function complete(Request $request, DailyMission $mission): JsonResponse
    {
        $user = $request->user();
        $today = now()->toDateString();

        $data = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*.question_id' => ['required', 'integer'],
            'answers.*.option_id' => ['nullable', 'integer'],
        ]);

        $existing = UserDailyMission::where('mission_id', $mission->daily_missions_id)
            ->where('user_id', $user->users_id)
            ->whereDate('mission_date', $today)
            ->first();

        if ($existing && $existing->is_completed) {
            return response()->json(['message' => 'Daily mission ini sudah diselesaikan hari ini.'], 409);
        }

        $mission->load('questions.options');
        $totalQuestions = $mission->questions->count();

        $correctCount = 0;
        foreach ($data['answers'] as $answer) {
            $question = $mission->questions->firstWhere('daily_mission_questions_id', $answer['question_id']);
            if (! $question) {
                continue;
            }

            $chosen = $question->options->firstWhere('daily_mission_options_id', $answer['option_id']);
            if ($chosen && $chosen->is_correct) {
                $correctCount++;
            }
        }

        $score = $totalQuestions > 0 ? (int) round(($correctCount / $totalQuestions) * 100) : 0;
        $passed = $score >= (int) $mission->passing_score;

        if (! $passed) {
            return response()->json([
                'passed' => false,
                'score' => $score,
                'message' => 'Belum lulus. Jawaban benar belum cukup, coba lagi.',
            ], 422);
        }

        $userMission = UserDailyMission::updateOrCreate(
            [
                'mission_id' => $mission->daily_missions_id,
                'user_id' => $user->users_id,
                'mission_date' => $today,
            ],
            [
                'progress' => $score,
                'is_completed' => true,
                'completed_at' => now(),
            ]
        );

        $rewardXp = $this->gamification->randomDailyMissionXp(
            (int) $mission->xp_reward_min,
            (int) $mission->xp_reward_max
        );

        $this->gamification->addXp($user, $rewardXp, null, "Daily Mission: {$mission->title}");

        $userMission->reward_claimed = true;
        $userMission->save();

        $this->maybeUnlockStreakAchievement($user);

        return response()->json([
            'mission' => $userMission,
            'score' => $score,
            'xp_awarded' => $rewardXp,
            'passed' => true,
        ]);
    }

    /**
     * Cek 7 hari kalender terakhir — kalau tiap hari ada minimal 1 daily
     * mission yang completed, unlock achievement 'daily_mission_streak_7'.
     */
    protected function maybeUnlockStreakAchievement($user): void
    {
        $completedDates = UserDailyMission::where('user_id', $user->users_id)
            ->where('is_completed', true)
            ->where('mission_date', '>=', now()->subDays(6)->toDateString())
            ->pluck('mission_date')
            ->map(fn ($date) => $date->toDateString())
            ->unique();

        $streak = collect(range(0, 6))
            ->map(fn ($i) => now()->subDays($i)->toDateString())
            ->every(fn ($date) => $completedDates->contains($date));

        if ($streak) {
            $this->gamification->unlockAchievement($user, 'daily_mission_streak_7');
        }
    }
}
