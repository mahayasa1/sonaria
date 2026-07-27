<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChallengeSubmission extends Model
{
    use HasFactory;

    protected $table = 'challenge_submissions';
    protected $primaryKey = 'challenge_submissions_id';

    protected $fillable = [
        'challenge_id',
        'user_id',
        'video_title',
        'video_path',
        'thumbnail',
        'duration',
        'file_size',
        'score',
        'feedback',
        'status',
        'reviewed_by',
        'submitted_at',
        'reviewed_at',
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function challenge(): BelongsTo
    {
        return $this->belongsTo(Challenge::class, 'challenge_id', 'challenges_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by', 'users_id');
    }
}
