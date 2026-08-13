<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * User model baru saja diaktifkan MustVerifyEmail supaya fitur verifikasi
 * email Fortify benar-benar berfungsi (lihat App\Models\User). Tanpa
 * migration ini, semua akun yang sudah terlanjur ada (status Active,
 * daftar sebelum fitur ini aktif) akan mendadak terkunci dari
 * settings/security & settings/appearance karena email_verified_at mereka
 * NULL. Migration ini hanya menandai akun yang SUDAH ada saat migration
 * ini jalan sebagai terverifikasi — user baru tetap wajib verifikasi email
 * seperti biasa.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')
            ->whereNull('email_verified_at')
            ->update(['email_verified_at' => now()]);
    }

    public function down(): void
    {
        // Tidak reversible dengan aman (tidak tahu email mana yang tadinya
        // benar-benar belum verifikasi vs yang di-backfill di sini).
    }
};
