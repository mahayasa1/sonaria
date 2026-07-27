<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leaderboards', function (Blueprint $table) {
            $table->id('leaderboards_id');
            $table->foreignId('community_id')
                ->constrained(table: 'communities', column: 'communities_id')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->string('total_xp', 11)->default(0);
            $table->string('total_point', 11)->default(0);
            $table->string('rank', 11)->nullable();
            $table->enum('period', ['Daily', 'Weekly', 'Monthly', 'Yearly']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leaderboards');
    }
};
