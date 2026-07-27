<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_roles', function (Blueprint $table) {
            $table->id('community_roles_id');
            $table->string('role_name', 50);
            $table->string('level_required', 11)->nullable();
            $table->string('description', 100)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_roles');
    }
};
