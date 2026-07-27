<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PracticeSubmission extends Model
{
    use HasFactory;

    protected $table = 'practice_submissions';
    protected $primaryKey = 'practice_submissions_id';

    protected $fillable = [
        'practice_id',
        'user_id',
        'video_title',
        'video_path',
        'thumbnail',
        'duration',
        'file_size',
        'submitted_at',
        'status',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function practice(): BelongsTo
    {
        return $this->belongsTo(Practice::class, 'practice_id', 'practices_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }

    public function review(): HasOne
    {
        return $this->hasOne(PracticeReview::class, 'submission_id', 'practice_submissions_id');
    }
}
