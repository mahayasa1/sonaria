<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Daily Mission dulu WAJIB punya quiz_id yang menunjuk ke tabel `quizzes`
 * milik Main Quest — jadi untuk bikin Daily Mission, Ketua harus bikin Quiz
 * dulu lewat alur Main Quest lalu tempel ID-nya manual. Sekarang Daily
 * Mission punya soal & opsi sendiri (daily_mission_questions /
 * daily_mission_options), lepas total dari sistem Quiz Main Quest.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('daily_missions', function (Blueprint $table) {
            $table->dropForeign(['quiz_id']);
            $table->dropColumn('quiz_id');
            $table->string('passing_score', 11)->default(100)->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('daily_missions', function (Blueprint $table) {
            $table->dropColumn('passing_score');
            $table->foreignId('quiz_id')->nullable()
                ->constrained(table: 'quizzes', column: 'quizzes_id')
                ->restrictOnDelete();
        });
    }
};
