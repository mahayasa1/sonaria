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
 * Satu akun Member untuk SETIAP level di tabel levels (level1@sonaria.test,
 * level2@sonaria.test, dst.), dengan total_xp tepat di batas bawah (min_xp)
 * level tersebut. Dibuat dari data Level sehingga kalau Admin menambah level
 * baru, jalankan ulang seeder ini dan akunnya ikut dibuat. Idempotent
 * (updateOrCreate), aman dijalankan berkali-kali.
 *
 * Login: level{N}@sonaria.test / password  (email sudah terverifikasi).
 *
 *   php artisan db:seed --class=LevelAccountSeeder
 */
class LevelAccountSeeder extends Seeder
{
    public const PASSWORD = 'password';

    public function run(): void
    {
        $memberRole = Role::where('role_name', 'Member')->firstOrFail();
        $instrumentId = Instrument::where('name', 'Gitar Akustik')->value('intruments_id')
            ?? Instrument::query()->value('intruments_id');

        foreach (Level::orderBy('level')->get() as $level) {
            $user = User::updateOrCreate(
                ['username' => "level_{$level->level}"],
                [
                    'role_id' => $memberRole->role_id,
                    'level_id' => $level->level_id,
                    'instrument_id' => $instrumentId,
                    'name' => "Level {$level->level} - {$level->title}",
                    'email' => "level{$level->level}@sonaria.test",
                    'password' => Hash::make(self::PASSWORD),
                    'bio' => "Akun testing Sonaria untuk Level {$level->level} ({$level->title}).",
                    'total_xp' => $level->min_xp,
                    'total_point' => 0,
                    'status' => 'Active',
                    'email_verified_at' => now(),
                ]
            );

            UserProfile::updateOrCreate(
                ['user_id' => $user->users_id],
                [
                    'gender' => 'Male',
                    'birth_date' => '2000-01-15',
                    'phone' => '0813'.str_pad((string) $user->users_id, 8, '0', STR_PAD_LEFT),
                    'address' => "Jl. Level No. {$level->level}",
                    'province' => 'DKI Jakarta',
                    'city' => 'Jakarta',
                    'profile_completed' => true,
                ]
            );
        }
    }
}
