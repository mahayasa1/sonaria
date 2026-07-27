<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizAnswer extends Model
{
    use HasFactory;

    protected $table = 'quiz_answers';
    protected $primaryKey = 'quiz_answers_id';

    protected $fillable = [
        'attempt_id',
        'question_id',
        'option_id',
        'is_correct',
        'score',
        'answered_at',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'answered_at' => 'datetime',
    ];

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(QuizAttempt::class, 'attempt_id', 'quiz_attempts_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(QuizQuestion::class, 'question_id', 'quiz_questions_id');
    }

    public function option(): BelongsTo
    {
        return $this->belongsTo(QuizOption::class, 'option_id', 'quiz_options_id');
    }
}
