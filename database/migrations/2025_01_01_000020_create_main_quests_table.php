<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('main_quests', function (Blueprint $table) {
            $table->id('main_quests_id');
            $table->foreignId('community_id')
                ->constrained(table: 'communities', column: 'communities_id')
                ->cascadeOnDelete();
            $table->foreignId('created_by')
                ->constrained(table: 'users', column: 'users_id')
                ->restrictOnDelete();
            // level: 1 - 7 (tepat 7 level main quest per komunitas)
            $table->string('level', 11);
            $table->string('title', 200);
            $table->string('description', 255)->nullable();
            $table->string('xp_reward', 11)->default(0);
            $table->string('point_reward', 11)->default(0);
            $table->enum('status', ['Draft', 'Published', 'Closed'])->default('Draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('main_quests');
    }
};
