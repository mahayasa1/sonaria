<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id('activity_logs_id');
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->string('activity', 150);
            $table->string('module', 100)->nullable();
            $table->longText('description')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('device', 150)->nullable();
            $table->string('browser', 100)->nullable();
            $table->string('operating_system', 100)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
