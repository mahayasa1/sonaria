<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forum_comments', function (Blueprint $table) {
            $table->id('forum_comments_id');
            $table->foreignId('post_id')
                ->constrained(table: 'forum_posts', column: 'forum_posts_id')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            // parent_id: self-reference untuk nested reply, nullable untuk komentar level teratas
            $table->foreignId('parent_id')
                ->nullable()
                ->constrained(table: 'forum_comments', column: 'forum_comments_id')
                ->cascadeOnDelete();
            $table->longText('comment');
            $table->enum('status', ['Active', 'Hidden', 'Deleted'])->default('Active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forum_comments');
    }
};
