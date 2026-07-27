<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('point_logs', function (Blueprint $table) {
            $table->id('point_logs_id');
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->string('activity', 100)->nullable();
            // reference_type + reference_id: relasi polymorphic manual ke berbagai
            // sumber poin (quiz, practice, challenge, dll), sengaja tanpa FK constraint.
            $table->string('reference_type', 100)->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('point', 11)->nullable();
            $table->string('description', 100)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('point_logs');
    }
};
