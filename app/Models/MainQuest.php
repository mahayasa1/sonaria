<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MainQuest extends Model
{
    use HasFactory;

    protected $table = 'main_quests';
    protected $primaryKey = 'main_quests_id';

    protected $fillable = [
        'community_id',
        'created_by',
        'level',
        'title',
        'description',
        'xp_reward',
        'point_reward',
        'status',
    ];

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class, 'community_id', 'communities_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by', 'users_id');
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class, 'main_quest_id', 'main_quests_id');
    }
}
