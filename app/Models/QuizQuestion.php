<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $table = 'quiz_questions';
    protected $primaryKey = 'quiz_questions_id';

    protected $fillable = [
        'quiz_id',
        'question',
        'image',
        'question_type',
        'score',
        'order_number',
    ];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class, 'quiz_id', 'quizzes_id');
    }

    public function options(): HasMany
    {
        return $this->hasMany(QuizOption::class, 'question_id', 'quiz_questions_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class, 'question_id', 'quiz_questions_id');
    }
}
