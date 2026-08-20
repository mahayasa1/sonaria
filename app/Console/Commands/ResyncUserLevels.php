<?php

namespace App\Console\Commands;

use App\Models\Level;
use App\Models\User;
use App\Models\UserLevelHistory;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Perbaikan satu kali (dan bisa dipakai ulang kapan saja) untuk user yang
 * level_id-nya sudah kadung salah/nyangkut karena bug lama: kolom
 * levels.min_xp sebelumnya bertipe string sehingga orderByDesc('min_xp')
 * di GamificationService::addXp() mengurutkan secara teks, bukan angka.
 *
 * Command ini menghitung ulang level_id yang benar untuk SEMUA user
 * berdasarkan total_xp mereka saat ini (levels sekarang sudah integer,
 * lihat migration 2026_08_20_000001_fix_levels_numeric_columns).
 *
 * Usage:
 *   php artisan users:resync-levels          # apply perubahan
 *   php artisan users:resync-levels --dry-run # cuma tampilkan yang akan berubah
 */
class ResyncUserLevels extends Command
{
    protected $signature = 'users:resync-levels {--dry-run : Tampilkan perubahan tanpa menyimpan}';

    protected $description = 'Hitung ulang level_id semua user berdasarkan total_xp saat ini';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $levels = Level::orderBy('min_xp')->get();

        if ($levels->isEmpty()) {
            $this->error('Tabel levels kosong. Jalankan LevelSeeder dulu.');
            return self::FAILURE;
        }

        $changed = 0;
        $checked = 0;

        User::with('level')->chunkById(200, function ($users) use ($levels, $dryRun, &$changed, &$checked) {
            foreach ($users as $user) {
                $checked++;

                $totalXp = (int) $user->total_xp;

                // Level yang benar: min_xp tertinggi yang masih <= total_xp user.
                $correctLevel = $levels
                    ->filter(fn (Level $level) => (int) $level->min_xp <= $totalXp)
                    ->sortByDesc(fn (Level $level) => (int) $level->min_xp)
                    ->first();

                if (! $correctLevel) {
                    continue;
                }

                if ($user->level_id === $correctLevel->level_id) {
                    continue;
                }

                $previousLevel = $user->level;

                $this->line(sprintf(
                    '- %s (total_xp=%d): level %s -> %s',
                    $user->username ?? $user->name ?? "#{$user->users_id}",
                    $totalXp,
                    $previousLevel?->level ?? '-',
                    $correctLevel->level
                ));

                $changed++;

                if ($dryRun) {
                    continue;
                }

                DB::transaction(function () use ($user, $correctLevel, $previousLevel, $totalXp) {
                    $user->level_id = $correctLevel->level_id;
                    $user->save();

                    UserLevelHistory::create([
                        'user_id' => $user->users_id,
                        'previous_level' => $previousLevel?->level,
                        'current_level' => $correctLevel->level,
                        'total_xp' => $totalXp,
                        'level_up_at' => now(),
                    ]);
                });
            }
        }, 'users_id');

        $this->newLine();

        if ($dryRun) {
            $this->info("Selesai (dry-run). {$checked} user dicek, {$changed} akan berubah level jika dijalankan tanpa --dry-run.");
        } else {
            $this->info("Selesai. {$checked} user dicek, {$changed} user diperbaiki level_id-nya.");
        }

        return self::SUCCESS;
    }
}
