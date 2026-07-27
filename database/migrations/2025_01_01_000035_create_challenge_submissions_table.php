<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenge_submissions', function (Blueprint $table) {
            $table->id('challenge_submissions_id');
            $table->foreignId('challenge_id')
                ->constrained(table: 'challenges', column: 'challenges_id')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->string('video_title', 150)->nullable();
            $table->string('video_path', 255);
            $table->string('thumbnail', 255)->nullable();
            $table->string('duration', 11)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->decimal('score', 5, 2)->nullable();
            $table->string('feedback', 255)->nullable();
            $table->enum('status', ['Pending', 'Approved', 'Revision', 'Rejected'])->default('Pending');
            $table->foreignId('reviewed_by')
                ->nullable()
                ->constrained(table: 'users', column: 'users_id')
                ->nullOnDelete();
            $table->dateTime('submitted_at')->nullable();
            $table->dateTime('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenge_submissions');
    }
};
