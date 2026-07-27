<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Leaderboard extends Model
{
    use HasFactory;

    protected $table = 'leaderboards';
    protected $primaryKey = 'leaderboards_id';

    protected $fillable = [
        'community_id',
        'user_id',
        'total_xp',
        'total_point',
        'rank',
        'period',
    ];

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class, 'community_id', 'communities_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }
}
