<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->id('materials_id');
            $table->foreignId('main_quest_id')
                ->constrained(table: 'main_quests', column: 'main_quests_id')
                ->cascadeOnDelete();
            $table->foreignId('instrument_id')
                ->constrained(table: 'instruments', column: 'intruments_id')
                ->restrictOnDelete();
            $table->string('title', 200);
            $table->string('slug', 200)->unique();
            $table->string('description', 255)->nullable();
            $table->enum('difficulty', ['Easy', 'Medium', 'Hard']);
            $table->string('estimated_time', 11)->nullable();
            $table->string('order_number', 11)->nullable();
            $table->string('thumbnail', 255)->nullable();
            $table->enum('status', ['Draft', 'Published'])->default('Draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
