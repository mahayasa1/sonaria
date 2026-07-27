<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class PointLog extends Model
{
    use HasFactory;

    protected $table = 'point_logs';
    protected $primaryKey = 'point_logs_id';

    protected $fillable = [
        'user_id',
        'activity',
        'reference_type',
        'reference_id',
        'point',
        'description',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }

    /**
     * Relasi polymorphic manual ke sumber poin (quiz, practice, challenge, dll).
     * reference_type diisi nama model (mis. App\Models\Quiz) dan reference_id
     * diisi primary key dari model tersebut.
     */
    public function reference(): MorphTo
    {
        return $this->morphTo(__FUNCTION__, 'reference_type', 'reference_id');
    }
}
