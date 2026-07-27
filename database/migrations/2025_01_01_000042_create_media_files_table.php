<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_files', function (Blueprint $table) {
            $table->id('media_files_id');
            $table->foreignId('uploaded_by')
                ->constrained(table: 'users', column: 'users_id')
                ->cascadeOnDelete();
            $table->string('file_name', 255);
            $table->string('original_name', 255)->nullable();
            $table->enum('file_type', ['Image', 'Video', 'Audio', 'PDF', 'Document']);
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('file_path', 255);
            $table->string('file_extension', 20)->nullable();
            $table->boolean('is_public')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
