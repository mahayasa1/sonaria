<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('communities', function (Blueprint $table) {
            $table->id('communities_id');
            $table->foreignId('owner_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->foreignId('category_id')
                ->constrained(table: 'music_categories', column: 'music_categories_id')
                ->restrictOnDelete();
            $table->string('community_name', 150);
            $table->string('logo', 255)->nullable();
            $table->string('banner', 255)->nullable();
            $table->string('description', 255)->nullable();
            $table->string('total_member', 11)->default(0);
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communities');
    }
};
