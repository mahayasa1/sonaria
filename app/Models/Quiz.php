<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory;

    protected $table = 'quizzes';
    protected $primaryKey = 'quizzes_id';

    protected $fillable = [
        'material_id',
        'title',
        'description',
        'total_questions',
        'duration',
        'passing_score',
        'xp_reward',
        'point_reward',
        'status',
    ];

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class, 'material_id', 'materials_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(QuizQuestion::class, 'quiz_id', 'quizzes_id');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class, 'quiz_id', 'quizzes_id');
    }

    public function dailyMissions(): HasMany
    {
        return $this->hasMany(DailyMission::class, 'quiz_id', 'quizzes_id');
    }
}
