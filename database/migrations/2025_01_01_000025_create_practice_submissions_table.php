<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('practice_submissions', function (Blueprint $table) {
            $table->id('practice_submissions_id');
            $table->foreignId('practice_id')
                ->constrained(table: 'practices', column: 'practices_id')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->string('video_title', 150)->nullable();
            $table->string('video_path', 255);
            $table->string('thumbnail', 255)->nullable();
            $table->string('duration', 11)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->dateTime('submitted_at')->nullable();
            $table->enum('status', ['Pending', 'Reviewed', 'Revision', 'Approved', 'Rejected'])->default('Pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('practice_submissions');
    }
};
