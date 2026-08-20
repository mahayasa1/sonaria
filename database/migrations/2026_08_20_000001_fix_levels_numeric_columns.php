<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Fix bug GAM-00X: kolom level/min_xp/max_xp di tabel `levels` sebelumnya
 * bertipe string. Akibatnya GamificationService::addXp() yang melakukan
 * `orderByDesc('min_xp')` mengurutkan berdasarkan teks (bukan angka),
 * sehingga level user tidak naik ke level yang benar walaupun total_xp
 * sudah memenuhi syarat min_xp level tersebut.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('levels', function (Blueprint $table) {
            $table->unsignedInteger('level')->change();
            $table->unsignedInteger('min_xp')->nullable()->change();
            $table->unsignedInteger('max_xp')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('levels', function (Blueprint $table) {
            $table->string('level', 11)->change();
            $table->string('min_xp', 11)->nullable()->change();
            $table->string('max_xp', 11)->nullable()->change();
        });
    }
};
