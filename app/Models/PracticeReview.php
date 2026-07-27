<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PracticeReview extends Model
{
    use HasFactory;

    protected $table = 'practice_reviews';
    protected $primaryKey = 'practice_reviews_id';

    protected $fillable = [
        'submission_id',
        'reviewer_id',
        'score',
        'technique_score',
        'rhythm_score',
        'expression_score',
        'feedback',
        'status',
        'reviewed_at',
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'reviewed_at' => 'datetime',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(PracticeSubmission::class, 'submission_id', 'practice_submissions_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id', 'users_id');
    }
}
