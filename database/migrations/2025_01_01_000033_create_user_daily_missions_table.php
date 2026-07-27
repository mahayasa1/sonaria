<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_daily_missions', function (Blueprint $table) {
            $table->id('user_daily_missions_id');
            $table->foreignId('mission_id')
                ->constrained(table: 'daily_missions', column: 'daily_missions_id')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->string('progress', 11)->default(0);
            $table->boolean('is_completed')->default(false);
            $table->boolean('reward_claimed')->default(false);
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_daily_missions');
    }
};
