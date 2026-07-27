<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_badges', function (Blueprint $table) {
            $table->id('user_badges_id');
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->foreignId('badge_id')
                ->constrained(table: 'badges', column: 'badges_id')
                ->cascadeOnDelete();
            $table->timestamp('earned_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_badges');
    }
};
