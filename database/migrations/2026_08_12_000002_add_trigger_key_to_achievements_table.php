<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Sebelumnya achievements cuma katalog statis (title/xp_reward/point_reward)
 * tanpa cara sistem tahu KAPAN sebuah achievement harus di-unlock — jadi
 * fiturnya "ada tabelnya" tapi tidak pernah benar-benar terpicu otomatis
 * (GAM-005/006). trigger_key menyimpan kode event yang memicu achievement
 * ini, dicocokkan oleh App\Services\GamificationService::unlockAchievement().
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            $table->string('trigger_key', 60)->nullable()->after('title');
        });
    }

    public function down(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            $table->dropColumn('trigger_key');
        });
    }
};
