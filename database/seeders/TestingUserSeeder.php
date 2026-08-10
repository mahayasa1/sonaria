<?php

namespace Database\Seeders;

use App\Models\Instrument;
use App\Models\Level;
use App\Models\Role;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder khusus testing: 1 admin + 15 user dengan kondisi level/instrumen/XP
 * yang berbeda-beda supaya seluruh state gamifikasi (dekat naik level, baru
 * naik level, level maksimum, dst.) bisa diuji tanpa harus main manual dulu.
 *
 * total_xp yang diisi di sini adalah XP AWAL (sebelum reward dari
 * quiz/practice/daily mission/challenge yang ditambahkan lewat
 * GamificationService di seeder lain). Total akhir akan lebih tinggi untuk
 * user yang punya aktivitas approved/passed.
 */
class TestingUserSeeder extends Seeder
{
    public function run(): void
    {
        $memberRole = Role::where('role_name', 'Member')->firstOrFail();
        $adminRole = Role::where('role_name', 'Admin')->firstOrFail();

        $levels = Level::pluck('level_id', 'level'); // level number => level_id
        $instruments = Instrument::pluck('intruments_id', 'name'); // name => id

        // username => [name, email, level, instrument|null, total_xp, total_point, gender, city]
        $users = [
            'admin_sonaria' => ['Admin Sonaria', 'admin@sonaria.test', 1, null, 0, 0, 'Laki-laki', 'Jakarta'],

            // Level 1 — baru mulai
            'user_pemula' => ['Raka', 'user_pemula@sonaria.test', 1, null, 20, 2, 'Laki-laki', 'Bandung'],
            'user_tempo' => ['Tempo', 'user_tempo@sonaria.test', 1, 'Gitar Akustik', 460, 40, 'Laki-laki', 'Surabaya'],

            // Level 2
            'user_chord' => ['Chord', 'user_chord@sonaria.test', 2, 'Gitar Akustik', 520, 50, 'Perempuan', 'Bandung'],
            'user_ritme' => ['Ritme', 'user_ritme@sonaria.test', 2, 'Drum Set', 750, 70, 'Laki-laki', 'Medan'],

            // Level 3
            'user_melodi' => ['Citra', 'user_melodi@sonaria.test', 3, 'Biola', 1050, 90, 'Perempuan', 'Yogyakarta'],
            'user_maestro' => ['Maestro', 'user_maestro@sonaria.test', 3, 'Cello', 1900, 150, 'Laki-laki', 'Semarang'],

            // Level 4 — Wakil Ketua & Staff komunitas Gitar
            'wakil_gitar' => ['Bima', 'wakilketua@sonaria.test', 4, 'Gitar Akustik', 2400, 200, 'Laki-laki', 'Bandung'],
            'staff_gitar' => ['Fajar', 'staff@sonaria.test', 4, 'Gitar Akustik', 2050, 180, 'Laki-laki', 'Bandung'],

            // Level 5
            'member_gitar' => ['Aditya', 'member@sonaria.test', 5, 'Gitar Akustik', 5350, 400, 'Laki-laki', 'Bandung'],
            'member_drum' => ['Nanda', 'member_drum@sonaria.test', 5, 'Drum Set', 3600, 260, 'Perempuan', 'Medan'],

            // Level 6
            'member_biola' => ['Vino', 'member_biola@sonaria.test', 6, 'Biola', 5600, 420, 'Laki-laki', 'Yogyakarta'],
            'member_trompet' => ['Yoga', 'member_trompet@sonaria.test', 6, 'Trompet', 7900, 600, 'Laki-laki', 'Makassar'],

            // Level 7 — Ketua komunitas
            'ketua_gitar' => ['Salsa', 'ketua@sonaria.test', 7, 'Gitar Akustik', 8000, 700, 'Perempuan', 'Bandung'],
            'ketua_drum' => ['Kevin', 'ketua_drum@sonaria.test', 7, 'Drum Set', 8000, 700, 'Laki-laki', 'Medan'],
            'ketua_biola' => ['Melodi', 'ketua_biola@sonaria.test', 7, 'Biola', 8000, 700, 'Perempuan', 'Yogyakarta'],
        ];

        foreach ($users as $username => $row) {
            [$name, $email, $levelNumber, $instrumentName, $totalXp, $totalPoint, $gender, $city] = $row;

            $user = User::updateOrCreate(
                ['username' => $username],
                [
                    'role_id' => $username === 'admin_sonaria' ? $adminRole->role_id : $memberRole->role_id,
                    'level_id' => $levels[$levelNumber] ?? $levels->first(),
                    'instrument_id' => $instrumentName ? ($instruments[$instrumentName] ?? null) : null,
                    'name' => $name,
                    'email' => $email,
                    'password' => Hash::make('password'),
                    'bio' => "Akun testing Sonaria untuk peran {$name}.",
                    'total_xp' => $totalXp,
                    'total_point' => $totalPoint,
                    'status' => 'Active',
                    'email_verified_at' => now(),
                ]
            );

            UserProfile::updateOrCreate(
                ['user_id' => $user->users_id],
                [
                    'gender' => $gender,
                    'birth_date' => '2000-01-15',
                    'phone' => '0812' . str_pad((string) $user->users_id, 8, '0', STR_PAD_LEFT),
                    'address' => "Jl. Musik No. {$user->users_id}",
                    'province' => $city === 'Jakarta' ? 'DKI Jakarta' : "Provinsi {$city}",
                    'city' => $city,
                    'profile_completed' => true,
                ]
            );
        }
    }
}
