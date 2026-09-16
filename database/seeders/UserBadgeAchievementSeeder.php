<?php

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\Badge;
use App\Models\User;
use App\Models\UserAchievement;
use App\Models\UserBadge;
use Illuminate\Database\Seeder;

/**
 * Melengkapi TestingGamificationSeeder (yang sengaja hanya memberi badge &
 * achievement ke sebagian kecil user untuk menguji empty state) dengan
 * jaminan bahwa SETIAP user non-Admin minimal punya 1 badge & 1 achievement,
 * bertingkat mengikuti level mereka. Tujuannya supaya
 * BadgeAchievementShowcase di semua Dashboard (Member, Ketua, Wakil Ketua,
 * Staff) selalu terlihat terisi saat QA/demo, bukan cuma untuk sebagian
 * akun testing.
 *
 * Idempotent (pakai updateOrCreate) — aman dijalankan berkali-kali dan tidak
 * membuat data duplikat kalau sebagian sudah diberikan oleh
 * TestingGamificationSeeder.
 *
 * Jalankan manual dengan:
 *   php artisan db:seed --class=UserBadgeAchievementSeeder
 * atau daftarkan di DatabaseSeeder::run() setelah TestingGamificationSeeder.
 */
class UserBadgeAchievementSeeder extends Seeder
{
    /**
     * Badge dibuka bertahap sesuai level user (lihat BadgeSeeder untuk daftar
     * lengkap & syarat aslinya). Level minimal => badge_name yang dibuka.
     *
     * @var array<int, string>
     */
    protected array $badgeTiers = [
        1 => 'Langkah Pertama',
        2 => 'Rajin Berlatih',
        4 => 'Juara Challenge',
        7 => 'Konduktor',
    ];

    /**
     * Achievement dibuka bertahap sesuai level user (lihat AchievementSeeder).
     * Level minimal => achievement title yang dibuka.
     *
     * @var array<int, string>
     */
    protected array $achievementTiers = [
        1 => 'Kontributor Forum',
        3 => 'Konsisten 7 Hari',
        5 => 'Penuntas Birama',
    ];

    public function run(): void
    {
        $badges = Badge::pluck('badges_id', 'badge_name');
        $achievements = Achievement::pluck('achievements_id', 'title');

        $users = User::with('role', 'level')
            ->whereHas('role', fn ($q) => $q->where('role_name', '!=', 'Admin'))
            ->get();

        foreach ($users as $index => $user) {
            $level = $user->level?->level ?? 1;

            foreach ($this->badgeTiers as $minLevel => $badgeName) {
                if ($level < $minLevel || ! isset($badges[$badgeName])) {
                    continue;
                }

                UserBadge::updateOrCreate(
                    ['user_id' => $user->users_id, 'badge_id' => $badges[$badgeName]],
                    ['earned_at' => now()->subDays(20 - $minLevel - $index % 5)]
                );
            }

            foreach ($this->achievementTiers as $minLevel => $title) {
                if ($level < $minLevel || ! isset($achievements[$title])) {
                    continue;
                }

                UserAchievement::updateOrCreate(
                    ['user_id' => $user->users_id, 'achievement_id' => $achievements[$title]],
                    ['achieved_at' => now()->subDays(15 - $minLevel - $index % 5)]
                );
            }
        }
    }
}
