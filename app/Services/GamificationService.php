<?php

namespace App\Services;

use App\Models\Level;
use App\Models\User;
use App\Models\UserCategoryPoint;
use App\Models\UserLevelHistory;
use App\Models\XpLog;
use App\Models\PointLog;
use Illuminate\Support\Facades\DB;

/**
 * Service terpusat untuk semua reward XP & Point di Sonaria.
 * Semua sumber reward (main quest, quiz, practice, daily mission, challenge)
 * WAJIB lewat service ini agar xp_logs / point_logs / level naik konsisten.
 */
class GamificationService
{
    /**
     * Tambahkan XP ke user, catat log, dan proses kenaikan level jika terpenuhi.
     */
    public function addXp(User $user, int $amount, ?int $categoryId = null, ?string $note = null): User
    {
        if ($amount <= 0) {
            return $user;
        }

        return DB::transaction(function () use ($user, $amount, $categoryId, $note) {
            $previousLevel = $user->level;
            $newTotalXp = (int) $user->total_xp + $amount;

            $user->total_xp = $newTotalXp;

            // Cek apakah XP baru melewati ambang level berikutnya
            $nextLevel = Level::where('min_xp', '<=', $newTotalXp)
                ->orderByDesc('min_xp')
                ->first();

            $leveledUp = $nextLevel && $previousLevel && $nextLevel->level_id !== $previousLevel->level_id;

            if ($nextLevel) {
                $user->level_id = $nextLevel->level_id;
            }

            $user->save();

            XpLog::create([
                'user_id' => $user->users_id,
                'previous_level' => $previousLevel?->level,
                'current_level' => $nextLevel?->level ?? $previousLevel?->level,
                'total_xp' => $newTotalXp,
                'level_up_at' => $leveledUp ? now() : null,
            ]);

            if ($leveledUp) {
                UserLevelHistory::create([
                    'user_id' => $user->users_id,
                    'previous_level' => $previousLevel?->level,
                    'current_level' => $nextLevel->level,
                    'total_xp' => $newTotalXp,
                    'level_up_at' => now(),
                ]);
            }

            if ($categoryId) {
                $this->addCategoryPoints($user, $categoryId, $amount, 0);
            }

            return $user->fresh();
        });
    }

    /**
     * Tambahkan Point ke user dan catat log (mis. dari quiz, practice, challenge).
     */
    public function addPoint(User $user, int $amount, string $activity, ?string $referenceType = null, ?int $referenceId = null, ?string $description = null): User
    {
        if ($amount <= 0) {
            return $user;
        }

        return DB::transaction(function () use ($user, $amount, $activity, $referenceType, $referenceId, $description) {
            $user->total_point = (int) $user->total_point + $amount;
            $user->save();

            PointLog::create([
                'user_id' => $user->users_id,
                'activity' => $activity,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'point' => $amount,
                'description' => $description,
            ]);

            return $user->fresh();
        });
    }

    /**
     * Akumulasi XP & Point per kategori alat musik (dipakai untuk statistik/leaderboard kategori).
     */
    protected function addCategoryPoints(User $user, int $categoryId, int $xp, int $point): void
    {
        $row = UserCategoryPoint::firstOrNew([
            'user_id' => $user->users_id,
            'category_id' => $categoryId,
        ]);

        $row->total_xp = (int) ($row->total_xp ?? 0) + $xp;
        $row->total_point = (int) ($row->total_point ?? 0) + $point;
        $row->updated_at = now();
        $row->save();
    }

    /**
     * Reward acak untuk Daily Mission (selalu kecil, sesuai rentang xp_reward_min - max).
     */
    public function randomDailyMissionXp(int $min, int $max): int
    {
        if ($max < $min) {
            [$min, $max] = [$max, $min];
        }

        return random_int($min, $max);
    }
}
