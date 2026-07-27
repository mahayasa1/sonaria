<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Catatan: nama kolom PK "intruments_id" mengikuti dokumen sumber (ada typo di
    // dokumen asli). Sesuaikan ke "instruments_id" jika tim ingin memperbaikinya.
    public function up(): void
    {
        Schema::create('instruments', function (Blueprint $table) {
            $table->id('intruments_id');
            $table->foreignId('category_id')
                ->constrained(table: 'music_categories', column: 'music_categories_id')
                ->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('image', 255)->nullable();
            $table->string('description', 100)->nullable();
            $table->enum('difficulty', ['Beginner', 'Intermediate', 'Advanced']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instruments');
    }
};
