<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('levels', function (Blueprint $table) {
            $table->id('level_id');
            $table->string('level', 11);
            $table->string('title', 100);
            $table->string('min_xp', 11)->nullable();
            $table->string('max_xp', 11)->nullable();
            $table->string('icon', 255)->nullable();
            $table->string('color', 30)->nullable();
            $table->boolean('can_create_community')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('levels');
    }
};
