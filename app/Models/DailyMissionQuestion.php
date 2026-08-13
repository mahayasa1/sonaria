<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DailyMissionQuestion extends Model
{
    use HasFactory;

    protected $table = 'daily_mission_questions';
    protected $primaryKey = 'daily_mission_questions_id';

    protected $fillable = [
        'daily_mission_id',
        'question',
        'order_number',
    ];

    public function dailyMission(): BelongsTo
    {
        return $this->belongsTo(DailyMission::class, 'daily_mission_id', 'daily_missions_id');
    }

    public function options(): HasMany
    {
        return $this->hasMany(DailyMissionOption::class, 'question_id', 'daily_mission_questions_id');
    }
}
