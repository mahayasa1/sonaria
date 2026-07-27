<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Challenge extends Model
{
    use HasFactory;

    protected $table = 'challenges';
    protected $primaryKey = 'challenges_id';

    protected $fillable = [
        'community_id',
        'created_by',
        'instrument_id',
        'title',
        'description',
        'xp_reward',
        'point_reward',
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

    public function instrument(): BelongsTo
    {
        return $this->belongsTo(Instrument::class, 'instrument_id', 'intruments_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(ChallengeSubmission::class, 'challenge_id', 'challenges_id');
    }
}
