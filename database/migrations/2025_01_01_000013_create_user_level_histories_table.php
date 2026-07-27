<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_level_histories', function (Blueprint $table) {
            $table->id('user_level_histories_id');
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->string('previous_level', 11)->nullable();
            $table->string('current_level', 11)->nullable();
            $table->string('total_xp', 11)->nullable();
            $table->dateTime('level_up_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_level_histories');
    }
};
