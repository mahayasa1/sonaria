<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizOption extends Model
{
    use HasFactory;

    protected $table = 'quiz_options';
    protected $primaryKey = 'quiz_options_id';

    protected $fillable = [
        'question_id',
        'option_label',
        'option_text',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(QuizQuestion::class, 'question_id', 'quiz_questions_id');
    }
}
