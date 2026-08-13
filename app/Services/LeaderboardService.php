<?php

namespace App\Services;

use App\Models\Community;
use App\Models\PointLog;
use App\Models\XpLog;
use Carbon\CarbonInterface as Carbon;
use Illuminate\Support\Collection;

/**
 * Menghitung peringkat leaderboard komunitas secara langsung (on-the-fly)
 * dari data user & log yang sudah ada (users.total_xp, xp_logs, point_logs).
 *
 * Kenapa tidak pakai tabel `leaderboards`? Karena sebelumnya tidak ada satu
 * pun kode yang menulis ke tabel tersebut (tidak ada job/command/observer),
 * sehingga leaderboard selalu kosong. Menghitung langsung dari sumber data
 * yang selalu akurat & konsisten menghindari kebutuhan job terjadwal serta
 * risiko data basi (stale snapshot).
 */
class LeaderboardService
{
    public const PERIODS = ['Weekly', 'Monthly', 'All Time'];

    /**
     * @return Collection<int, array{rank:int, user: \App\Models\User, total_xp:int, total_point:int}>
     */
    public function getRankings(Community $community, string $period): Collection
    {
        $period = in_array($period, self::PERIODS, true) ? $period : 'Weekly';

        $members = $community->members()
            ->where('status', 'Active')
            ->with('user')
            ->get()
            ->pluck('user')
            ->filter();

        if ($members->isEmpty()) {
            return collect();
        }

        [$startsAt, ] = $this->periodBounds($period);

        $rows = $members->map(function ($user) use ($startsAt, $period) {
            if ($period === 'All Time' || $startsAt === null) {
                $xp = (int) $user->total_xp;
                $point = (int) $user->total_point;
            } else {
                $xp = $this->xpGainedSince($user->users_id, $startsAt);
                $point = (int) PointLog::where('user_id', $user->users_id)
                    ->where('created_at', '>=', $startsAt)
                    ->sum('point');
            }

            return [
                'user' => $user,
                'total_xp' => $xp,
                'total_point' => $point,
            ];
        });

        return $rows
            ->sortByDesc(fn ($row) => [$row['total_xp'], $row['total_point']])
            ->values()
            ->map(function ($row, $index) {
                $row['rank'] = $index + 1;

                return $row;
            });
    }

    /**
     * XP yang didapat sejak $startsAt, dihitung dari selisih snapshot
     * kumulatif di xp_logs (total_xp terakhir sekarang - total_xp terakhir
     * sebelum periode dimulai), karena xp_logs menyimpan nilai kumulatif,
     * bukan delta per baris.
     */
    protected function xpGainedSince(int $userId, Carbon $startsAt): int
    {
        $latest = (int) (XpLog::where('user_id', $userId)
            ->latest('xp_log_id')
            ->value('total_xp') ?? 0);

        $before = (int) (XpLog::where('user_id', $userId)
            ->where('created_at', '<', $startsAt)
            ->latest('xp_log_id')
            ->value('total_xp') ?? 0);

        return max(0, $latest - $before);
    }

    /**
     * @return array{0: ?Carbon, 1: ?Carbon}
     */
    protected function periodBounds(string $period): array
    {
        return match ($period) {
            'Weekly' => [now()->startOfWeek(), now()],
            'Monthly' => [now()->startOfMonth(), now()],
            default => [null, null],
        };
    }
}
