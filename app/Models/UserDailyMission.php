<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDailyMission extends Model
{
    use HasFactory;

    protected $table = 'user_daily_missions';
    protected $primaryKey = 'user_daily_missions_id';

    protected $fillable = [
        'mission_id',
        'user_id',
        'mission_date',
        'progress',
        'is_completed',
        'reward_claimed',
        'completed_at',
    ];

    protected $casts = [
        'mission_date' => 'date',
        'is_completed' => 'boolean',
        'reward_claimed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function mission(): BelongsTo
    {
        return $this->belongsTo(DailyMission::class, 'mission_id', 'daily_missions_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }
}
