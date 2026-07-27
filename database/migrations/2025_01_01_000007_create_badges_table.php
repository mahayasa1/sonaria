<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('badges', function (Blueprint $table) {
            $table->id('badges_id');
            $table->string('badge_name', 100);
            $table->string('icon', 255)->nullable();
            $table->string('description', 100)->nullable();
            $table->string('xp_required', 11)->nullable();
            $table->string('point_required', 11)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('badges');
    }
};
