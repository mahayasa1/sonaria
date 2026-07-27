<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('material_progress', function (Blueprint $table) {
            $table->id('material_progress_id');
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->foreignId('material_id')
                ->constrained(table: 'materials', column: 'materials_id')
                ->cascadeOnDelete();
            $table->unsignedTinyInteger('progress_percentage')->default(0);
            $table->enum('status', ['Not Started', 'In Progress', 'Completed'])->default('Not Started');
            $table->dateTime('started_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->dateTime('last_access_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('material_progress');
    }
};
