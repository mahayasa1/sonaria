<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Minimal 50 activity log tersebar ke berbagai user, mencakup aktivitas umum
 * (Login/Logout), belajar (Complete Quest/Quiz/Practice), sosial (forum),
 * dan gamifikasi (Level Up). Data device/browser/OS bersifat tetap (tidak
 * pakai faker random) supaya seeder deterministic.
 */
class TestingActivityLogSeeder extends Seeder
{
    /**
     * Daftar template aktivitas yang dipakai bergantian untuk semua user.
     *
     * @var array<int, array{0: string, 1: string, 2: string}> [activity, module, description]
     */
    protected array $activityTemplates = [
        ['Login', 'Auth', 'User berhasil login ke aplikasi.'],
        ['Logout', 'Auth', 'User logout dari aplikasi.'],
        ['Pilih Instrumen', 'Onboarding', 'User memilih instrumen utama pada saat onboarding.'],
        ['Ajukan Gabung Komunitas', 'Community', 'User mengajukan permintaan bergabung ke sebuah komunitas.'],
        ['Selesaikan Main Quest', 'Learning', 'User menyelesaikan sebuah level Main Quest.'],
        ['Selesaikan Quiz', 'Learning', 'User menyelesaikan sebuah quiz.'],
        ['Kirim Practice Submission', 'Learning', 'User mengirim rekaman practice submission.'],
        ['Review Practice Submission', 'Community', 'Reviewer memberi penilaian pada practice submission.'],
        ['Buat Post Forum', 'Forum', 'User membuat post baru di forum komunitas.'],
        ['Komentar Forum', 'Forum', 'User memberi komentar pada post forum.'],
        ['Like Post Forum', 'Forum', 'User menyukai sebuah post forum.'],
        ['Kirim Challenge Submission', 'Learning', 'User mengirim submission untuk sebuah challenge.'],
        ['Naik Level', 'Gamification', 'Level user naik setelah mengumpulkan XP.'],
        ['Klaim Reward Daily Mission', 'Gamification', 'User mengklaim reward dari daily mission yang selesai.'],
    ];

    protected array $devices = [
        ['device' => 'iPhone 13', 'browser' => 'Safari', 'os' => 'iOS 17', 'ip' => '110.138.10.21'],
        ['device' => 'Samsung Galaxy S22', 'browser' => 'Chrome', 'os' => 'Android 14', 'ip' => '110.138.10.45'],
        ['device' => 'MacBook Pro', 'browser' => 'Chrome', 'os' => 'macOS 14', 'ip' => '36.68.21.100'],
        ['device' => 'Windows PC', 'browser' => 'Edge', 'os' => 'Windows 11', 'ip' => '36.68.21.150'],
    ];

    public function run(): void
    {
        if (ActivityLog::count() >= 50) {
            return;
        }

        $users = User::whereIn('username', [
            'admin_sonaria', 'user_pemula', 'user_tempo', 'user_chord', 'user_ritme', 'user_melodi', 'user_maestro',
            'wakil_gitar', 'staff_gitar', 'member_gitar', 'member_drum', 'member_biola', 'member_trompet',
            'ketua_gitar', 'ketua_drum', 'ketua_biola',
        ])->get();

        $counter = 0;

        foreach ($users as $user) {
            // Setiap user diberi 3-4 log aktivitas berbeda, dipilih berputar
            // dari template supaya variasinya merata dan totalnya > 50.
            $activityCount = 3 + ($user->users_id % 2); // 3 atau 4

            for ($i = 0; $i < $activityCount; $i++) {
                $template = $this->activityTemplates[($user->users_id + $i) % count($this->activityTemplates)];
                $device = $this->devices[($user->users_id + $i) % count($this->devices)];

                ActivityLog::create([
                    'user_id' => $user->users_id,
                    'activity' => $template[0],
                    'module' => $template[1],
                    'description' => $template[2],
                    'ip_address' => $device['ip'],
                    'device' => $device['device'],
                    'browser' => $device['browser'],
                    'operating_system' => $device['os'],
                    'created_at' => now()->subDays(10)->addHours($counter),
                ]);

                $counter++;
            }
        }
    }
}
