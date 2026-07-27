<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id('quiz_questions_id');
            $table->foreignId('quiz_id')
                ->constrained(table: 'quizzes', column: 'quizzes_id')
                ->cascadeOnDelete();
            $table->longText('question');
            $table->string('image', 255)->nullable();
            $table->enum('question_type', ['Multiple Choice'])->default('Multiple Choice');
            $table->string('score', 11)->default(0);
            $table->string('order_number', 11)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
