<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_mission_options', function (Blueprint $table) {
            $table->id('daily_mission_options_id');
            $table->foreignId('question_id')
                ->constrained(table: 'daily_mission_questions', column: 'daily_mission_questions_id')
                ->cascadeOnDelete();
            $table->string('option_label', 10);
            $table->string('option_text', 255);
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_mission_options');
    }
};
