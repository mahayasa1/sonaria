<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_mission_questions', function (Blueprint $table) {
            $table->id('daily_mission_questions_id');
            $table->foreignId('daily_mission_id')
                ->constrained(table: 'daily_missions', column: 'daily_missions_id')
                ->cascadeOnDelete();
            $table->text('question');
            $table->string('order_number', 11)->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_mission_questions');
    }
};
