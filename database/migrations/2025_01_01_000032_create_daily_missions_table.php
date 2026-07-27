<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_missions', function (Blueprint $table) {
            $table->id('daily_missions_id');
            $table->foreignId('community_id')
                ->constrained(table: 'communities', column: 'communities_id')
                ->cascadeOnDelete();
            $table->foreignId('created_by')
                ->constrained(table: 'users', column: 'users_id')
                ->restrictOnDelete();
            $table->foreignId('quiz_id')
                ->constrained(table: 'quizzes', column: 'quizzes_id')
                ->restrictOnDelete();
            $table->string('title', 200);
            $table->string('description', 255)->nullable();
            // mission_number: 1 - 6 (tepat 6 daily mission per komunitas per periode)
            $table->string('mission_number', 11);
            $table->string('xp_reward_min', 11)->default(0);
            $table->string('xp_reward_max', 11)->default(0);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->enum('status', ['Draft', 'Active', 'Inactive'])->default('Draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_missions');
    }
};
