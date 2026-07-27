<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id('user_profiles_id');
            $table->foreignId('user_id')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->enum('gender', ['Laki-laki', 'Perempuan'])->nullable();
            $table->date('birth_date')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('address', 100)->nullable();
            $table->string('province', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->boolean('profile_completed')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
