<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Achievement extends Model
{
    use HasFactory;

    protected $table = 'achievements';
    protected $primaryKey = 'achievements_id';

    protected $fillable = [
        'title',
        'trigger_key',
        'description',
        'icon',
        'xp_reward',
        'point_reward',
    ];

    /**
     * Kode trigger bawaan yang dikenali GamificationService::unlockAchievement().
     * Dipakai untuk dropdown di form Admin > Achievements supaya admin tidak
     * salah ketik kode yang tidak pernah dicocokkan sistem.
     */
    public const TRIGGERS = [
        'first_quiz_passed' => 'Pertama kali lulus Quiz',
        'first_practice_approved' => 'Pertama kali Practice disetujui',
        'first_challenge_won' => 'Pertama kali Challenge disetujui',
        'daily_mission_streak_7' => 'Daily Mission 7 hari beruntun',
        'reach_level_5' => 'Mencapai Level 5',
        'reach_level_10' => 'Mencapai Level 10',
    ];

    public function userAchievements(): HasMany
    {
        return $this->hasMany(UserAchievement::class, 'achievement_id', 'achievements_id');
    }
}
