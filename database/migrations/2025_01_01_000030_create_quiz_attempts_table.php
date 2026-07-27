<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id('quiz_attempts_id');
            $table->foreignId('quiz_id')
                ->constrained(table: 'quizzes', column: 'quizzes_id')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->decimal('score', 5, 2)->nullable();
            $table->string('total_correct', 11)->default(0);
            $table->string('total_wrong', 11)->default(0);
            $table->boolean('is_passed')->default(false);
            $table->dateTime('started_at')->nullable();
            $table->dateTime('finished_at')->nullable();
            $table->string('duration', 11)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_attempts');
    }
};
