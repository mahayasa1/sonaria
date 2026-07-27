<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('material_files', function (Blueprint $table) {
            $table->id('material_files_id');
            $table->foreignId('material_id')
                ->constrained(table: 'materials', column: 'materials_id')
                ->cascadeOnDelete();
            $table->enum('file_type', ['Video', 'PDF', 'Audio', 'Image']);
            $table->string('title', 150);
            $table->string('file_name', 255);
            $table->string('file_path', 255);
            $table->string('duration', 11)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('material_files');
    }
};
