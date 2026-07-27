<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_answers', function (Blueprint $table) {
            $table->id('quiz_answers_id');
            $table->foreignId('attempt_id')
                ->constrained(table: 'quiz_attempts', column: 'quiz_attempts_id')
                ->cascadeOnDelete();
            $table->foreignId('question_id')
                ->constrained(table: 'quiz_questions', column: 'quiz_questions_id')
                ->cascadeOnDelete();
            $table->foreignId('option_id')
                ->nullable()
                ->constrained(table: 'quiz_options', column: 'quiz_options_id')
                ->nullOnDelete();
            $table->boolean('is_correct')->default(false);
            $table->string('score', 11)->default(0);
            $table->dateTime('answered_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_answers');
    }
};
