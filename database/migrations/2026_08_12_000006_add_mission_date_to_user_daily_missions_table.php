<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Sebelumnya cuma ada 1 baris per (user, mission) selamanya — begitu
 * is_completed jadi true, tidak ada cara buat "reset" besok karena tidak
 * ada informasi tanggal sama sekali (DM-002). Dengan mission_date, setiap
 * hari otomatis dapat baris baru (reset alami, tanpa perlu job/cron
 * terjadwal) sekaligus jadi riwayat harian untuk hitung streak.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_daily_missions', function (Blueprint $table) {
            $table->date('mission_date')->default(now()->toDateString())->after('user_id');
        });

        Schema::table('user_daily_missions', function (Blueprint $table) {
            $table->unique(['mission_id', 'user_id', 'mission_date'], 'user_daily_missions_unique_per_day');
        });
    }

    public function down(): void
    {
        Schema::table('user_daily_missions', function (Blueprint $table) {
            $table->dropUnique('user_daily_missions_unique_per_day');
            $table->dropColumn('mission_date');
        });
    }
};
