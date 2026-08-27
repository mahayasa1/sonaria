<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_main_quest_completions', function (Blueprint $table) {
            $table->id('user_main_quest_completions_id');
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->foreignId('main_quest_id')
                ->constrained(table: 'main_quests', column: 'main_quests_id')
                ->cascadeOnDelete();
            $table->timestamp('completed_at');
            $table->timestamps();

            $table->unique(['user_id', 'main_quest_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_main_quest_completions');
    }
};
