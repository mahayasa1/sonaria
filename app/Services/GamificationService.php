<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\Badge;
use App\Models\Level;
use App\Models\User;
use App\Models\UserAchievement;
use App\Models\UserBadge;
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

            $fresh = $user->fresh();

            $this->checkBadges($fresh);

            if ($leveledUp && $nextLevel) {
                if ($nextLevel->level == 5) {
                    $this->unlockAchievement($fresh, 'reach_level_5');
                } elseif ($nextLevel->level == 10) {
                    $this->unlockAchievement($fresh, 'reach_level_10');
                }
            }

            return $fresh;
        });
    }

    /**
     * Tambahkan Point ke user dan catat log (mis. dari quiz, practice, challenge).
     */
    public function addPoint(User $user, int $amount, string $activity, ?string $referenceType = null, ?int $referenceId = null, ?string $description = null, ?int $categoryId = null): User
    {
        if ($amount <= 0) {
            return $user;
        }

        return DB::transaction(function () use ($user, $amount, $activity, $referenceType, $referenceId, $description, $categoryId) {
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

            // Sebelumnya addCategoryPoints cuma pernah dipanggil dari addXp
            // dengan point=0 — akibatnya kolom total_point di
            // user_category_points tidak pernah kebentuk sama sekali
            // walaupun user sudah dapat banyak point (GAM-004).
            if ($categoryId) {
                $this->addCategoryPoints($user, $categoryId, 0, $amount);
            }

            $fresh = $user->fresh();

            $this->checkBadges($fresh);

            return $fresh;
        });
    }

    /**
     * Cek semua badge yang belum dimiliki user, dan berikan kalau syarat
     * xp_required / point_required sudah terpenuhi. Dipanggil otomatis
     * setiap kali XP atau Point bertambah — sebelumnya tidak ada satupun
     * kode yang mengecek/memberikan badge (GAM-005).
     */
    public function checkBadges(User $user): void
    {
        $earnedIds = UserBadge::where('user_id', $user->users_id)->pluck('badge_id');

        $eligible = Badge::whereNotIn('badges_id', $earnedIds)
            ->get()
            ->filter(function (Badge $badge) use ($user) {
                $meetsXp = ! $badge->xp_required || (int) $user->total_xp >= (int) $badge->xp_required;
                $meetsPoint = ! $badge->point_required || (int) $user->total_point >= (int) $badge->point_required;

                return $meetsXp && $meetsPoint;
            });

        foreach ($eligible as $badge) {
            UserBadge::create([
                'user_id' => $user->users_id,
                'badge_id' => $badge->badges_id,
                'earned_at' => now(),
            ]);
        }
    }

    /**
     * Unlock 1 achievement (by trigger_key) untuk user, kalau achievement
     * dengan trigger_key itu ada & belum pernah didapat user ini. Dipanggil
     * dari titik-titik event tertentu (quiz pertama lulus, practice/challenge
     * disetujui, dst) — lihat Achievement::TRIGGERS untuk daftar kode yang
     * dikenali. Sebelumnya tidak ada mekanisme trigger sama sekali (GAM-006).
     */
    public function unlockAchievement(User $user, string $triggerKey): void
    {
        $achievement = Achievement::where('trigger_key', $triggerKey)->first();

        if (! $achievement) {
            return;
        }

        $already = UserAchievement::where('user_id', $user->users_id)
            ->where('achievement_id', $achievement->achievements_id)
            ->exists();

        if ($already) {
            return;
        }

        UserAchievement::create([
            'user_id' => $user->users_id,
            'achievement_id' => $achievement->achievements_id,
            'achieved_at' => now(),
        ]);

        if ($achievement->xp_reward > 0) {
            $this->addXp($user, (int) $achievement->xp_reward, null, "Achievement: {$achievement->title}");
        }

        if ($achievement->point_reward > 0) {
            $this->addPoint($user, (int) $achievement->point_reward, 'Achievement Unlocked', Achievement::class, $achievement->achievements_id);
        }
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
