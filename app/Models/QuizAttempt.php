<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuizAttempt extends Model
{
    use HasFactory;

    protected $table = 'quiz_attempts';
    protected $primaryKey = 'quiz_attempts_id';

    protected $fillable = [
        'quiz_id',
        'user_id',
        'score',
        'total_correct',
        'total_wrong',
        'is_passed',
        'started_at',
        'finished_at',
        'duration',
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'is_passed' => 'boolean',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
    ];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class, 'quiz_id', 'quizzes_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class, 'attempt_id', 'quiz_attempts_id');
    }
}
