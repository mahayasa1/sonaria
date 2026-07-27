<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Community extends Model
{
    use HasFactory;

    protected $table = 'communities';
    protected $primaryKey = 'communities_id';

    protected $fillable = [
        'owner_id',
        'category_id',
        'community_name',
        'logo',
        'banner',
        'description',
        'total_member',
        'status',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id', 'users_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(MusicCategory::class, 'category_id', 'music_categories_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(CommunityMember::class, 'community_id', 'communities_id');
    }

    public function joinRequests(): HasMany
    {
        return $this->hasMany(CommunityJoinRequest::class, 'community_id', 'communities_id');
    }

    public function mainQuests(): HasMany
    {
        return $this->hasMany(MainQuest::class, 'community_id', 'communities_id');
    }

    public function dailyMissions(): HasMany
    {
        return $this->hasMany(DailyMission::class, 'community_id', 'communities_id');
    }

    public function challenges(): HasMany
    {
        return $this->hasMany(Challenge::class, 'community_id', 'communities_id');
    }

    public function leaderboards(): HasMany
    {
        return $this->hasMany(Leaderboard::class, 'community_id', 'communities_id');
    }

    public function forumPosts(): HasMany
    {
        return $this->hasMany(ForumPost::class, 'community_id', 'communities_id');
    }
}
