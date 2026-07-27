<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('music_categories', function (Blueprint $table) {
            $table->id('music_categories_id');
            $table->string('name', 100);
            $table->string('icon', 255)->nullable();
            $table->string('description', 100)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('music_categories');
    }
};
