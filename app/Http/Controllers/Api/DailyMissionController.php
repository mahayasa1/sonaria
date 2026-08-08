<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\DailyMission;
use App\Models\UserDailyMission;
use App\Services\GamificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class DailyMissionController extends Controller
{
    public function __construct(protected GamificationService $gamification)
    {
    }

    /**
     * 6 daily mission komunitas untuk hari ini beserta progress user.
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
            ->with('quiz')
            ->get()
            ->map(function (DailyMission $mission) use ($user) {
                $mission->setRelation(
                    'my_progress',
                    UserDailyMission::where('mission_id', $mission->daily_missions_id)
                        ->where('user_id', $user->users_id)
                        ->first()
                );

                return $mission;
            });

        return response()->json($missions);
    }

    /**
     * Buat daily mission baru (khusus Ketua/Wakil Ketua). Maksimal 6 per komunitas per periode aktif.
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
            'quiz_id' => ['required', 'exists:quizzes,quizzes_id'],
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:255'],
            'mission_number' => ['required', 'integer', 'min:1', 'max:6'],
            'xp_reward_min' => ['required', 'integer', 'min:1'],
            'xp_reward_max' => ['required', 'integer', 'gte:xp_reward_min'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
        ]);

        $mission = $community->dailyMissions()->create([
            ...$data,
            'created_by' => $request->user()->users_id,
            'status' => 'Active',
        ]);

        return response()->json($mission, 201);
    }

    /**
     * Tandai mission selesai setelah quiz-nya lulus, lalu cairkan reward XP acak (kecil).
     */
    public function complete(Request $request, DailyMission $mission): JsonResponse
    {
        $user = $request->user();

        $userMission = UserDailyMission::firstOrNew([
            'mission_id' => $mission->daily_missions_id,
            'user_id' => $user->users_id,
        ]);

        if ($userMission->exists && $userMission->is_completed) {
            return response()->json(['message' => 'Daily mission ini sudah diselesaikan.'], 409);
        }

        $userMission->progress = 100;
        $userMission->is_completed = true;
        $userMission->completed_at = now();
        $userMission->save();

        $rewardXp = $this->gamification->randomDailyMissionXp(
            (int) $mission->xp_reward_min,
            (int) $mission->xp_reward_max
        );

        $this->gamification->addXp($user, $rewardXp, null, "Daily Mission: {$mission->title}");

        $userMission->reward_claimed = true;
        $userMission->save();

        return response()->json([
            'mission' => $userMission,
            'xp_awarded' => $rewardXp,
        ]);
    }

    /**
     * Nonaktifkan daily mission (khusus Ketua/Wakil Ketua), supaya slot-nya
     * bisa dipakai mission baru tanpa menghapus riwayat data lama.
     */
    public function deactivate(Request $request, DailyMission $mission): JsonResponse
    {
        $this->authorize('manage', $mission->community);

        $mission->update(['status' => 'Inactive']);

        return response()->json($mission);
    }
}
