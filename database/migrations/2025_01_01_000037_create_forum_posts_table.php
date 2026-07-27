<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forum_posts', function (Blueprint $table) {
            $table->id('forum_posts_id');
            $table->foreignId('community_id')
                ->constrained(table: 'communities', column: 'communities_id')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->string('title', 200);
            $table->longText('content');
            $table->string('image', 255)->nullable();
            $table->string('total_like', 11)->default(0);
            $table->string('total_comment', 11)->default(0);
            $table->enum('status', ['Published', 'Hidden', 'Deleted'])->default('Published');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forum_posts');
    }
};
