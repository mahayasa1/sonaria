<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommunityMember extends Model
{
    use HasFactory;

    protected $table = 'community_members';
    protected $primaryKey = 'community_members_id';

    protected $fillable = [
        'community_id',
        'user_id',
        'role_id',
        'join_date',
        'status',
    ];

    protected $casts = [
        'join_date' => 'datetime',
    ];

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class, 'community_id', 'communities_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(CommunityRole::class, 'role_id', 'community_roles_id');
    }
}
