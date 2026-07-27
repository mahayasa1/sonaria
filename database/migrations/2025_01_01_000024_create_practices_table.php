<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('practices', function (Blueprint $table) {
            $table->id('practices_id');
            $table->foreignId('material_id')
                ->constrained(table: 'materials', column: 'materials_id')
                ->cascadeOnDelete();
            $table->string('title', 200);
            $table->string('description', 255)->nullable();
            $table->string('minimum_score', 11)->nullable();
            $table->string('xp_reward', 11)->default(0);
            $table->string('point_reward', 11)->default(0);
            $table->dateTime('deadline')->nullable();
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('practices');
    }
};
