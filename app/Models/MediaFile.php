<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaFile extends Model
{
    use HasFactory;

    protected $table = 'media_files';
    protected $primaryKey = 'media_files_id';

    protected $fillable = [
        'uploaded_by',
        'file_name',
        'original_name',
        'file_type',
        'mime_type',
        'file_size',
        'file_path',
        'file_extension',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by', 'users_id');
    }
}
