<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_category_points', function (Blueprint $table) {
            $table->id('user_category_points_id');
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->foreignId('category_id')
                ->constrained(table: 'music_categories', column: 'music_categories_id')
                ->cascadeOnDelete();
            $table->string('total_xp', 11)->default(0);
            $table->string('total_point', 11)->default(0);
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_category_points');
    }
};
