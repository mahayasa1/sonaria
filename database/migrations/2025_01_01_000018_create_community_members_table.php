<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_members', function (Blueprint $table) {
            $table->id('community_members_id');
            $table->foreignId('community_id')
                ->constrained(table: 'communities', column: 'communities_id')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->foreignId('role_id')
                ->constrained(table: 'community_roles', column: 'community_roles_id')
                ->restrictOnDelete();
            $table->dateTime('join_date')->nullable();
            $table->enum('status', ['Active', 'Pending', 'Removed'])->default('Pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_members');
    }
};
