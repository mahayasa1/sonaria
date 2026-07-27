<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('practice_reviews', function (Blueprint $table) {
            $table->id('practice_reviews_id');
            $table->foreignId('submission_id')
                ->constrained(table: 'practice_submissions', column: 'practice_submissions_id')
                ->cascadeOnDelete();
            $table->foreignId('reviewer_id')
                ->constrained(table: 'users', column: 'users_id')
                ->restrictOnDelete();
            $table->decimal('score', 5, 2)->nullable();
            $table->string('technique_score', 11)->nullable();
            $table->string('rhythm_score', 11)->nullable();
            $table->string('expression_score', 11)->nullable();
            $table->string('feedback', 255)->nullable();
            $table->enum('status', ['Approved', 'Revision', 'Rejected'])->default('Revision');
            $table->dateTime('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('practice_reviews');
    }
};
