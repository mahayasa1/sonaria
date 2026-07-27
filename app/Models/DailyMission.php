<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DailyMission extends Model
{
    use HasFactory;

    protected $table = 'daily_missions';
    protected $primaryKey = 'daily_missions_id';

    protected $fillable = [
        'community_id',
        'created_by',
        'quiz_id',
        'title',
        'description',
        'mission_number',
        'xp_reward_min',
        'xp_reward_max',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class, 'community_id', 'communities_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by', 'users_id');
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class, 'quiz_id', 'quizzes_id');
    }

    public function userMissions(): HasMany
    {
        return $this->hasMany(UserDailyMission::class, 'mission_id', 'daily_missions_id');
    }
}
