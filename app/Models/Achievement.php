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
        'description',
        'icon',
        'xp_reward',
        'point_reward',
    ];

    public function userAchievements(): HasMany
    {
        return $this->hasMany(UserAchievement::class, 'achievement_id', 'achievements_id');
    }
}
