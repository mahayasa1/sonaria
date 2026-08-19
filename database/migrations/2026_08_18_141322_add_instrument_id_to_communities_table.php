<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('communities', function (Blueprint $table) {
            $table->foreignId('instrument_id')
                ->nullable()
                ->after('category_id')
                ->constrained(table: 'instruments', column: 'intruments_id')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('communities', function (Blueprint $table) {
            $table->dropConstrainedForeignId('instrument_id');
        });
    }
};