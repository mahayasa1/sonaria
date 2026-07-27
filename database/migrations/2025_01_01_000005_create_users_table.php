<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         Schema::create('users', function (Blueprint $table) {
            $table->id('users_id');
            $table->foreignId('role_id')
                ->constrained(table: 'roles', column: 'role_id')
                ->restrictOnDelete();
            $table->foreignId('level_id')
                ->constrained(table: 'levels', column: 'level_id')
                ->restrictOnDelete();
            $table->foreignId('instrument_id')
                ->nullable()
                ->constrained(table: 'instruments', column: 'intruments_id')
                ->nullOnDelete();
            $table->string('username', 50)->unique();
            $table->string('name', 100);
            $table->string('email', 100)->unique();
            $table->string('password', 100);
            $table->string('photo', 255)->nullable();
            $table->string('bio', 100)->nullable();
            $table->string('total_xp', 11)->default(0);
            $table->string('total_point', 11)->default(0);
            $table->enum('status', ['Active', 'Inactive', 'Banned'])->default('Active');
            // Tambahan standar Laravel auth (tidak ada di dokumen sumber, tapi
            // dibutuhkan untuk fitur login/verifikasi/remember-me):
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
