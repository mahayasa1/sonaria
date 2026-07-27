<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommunityRole extends Model
{
    use HasFactory;

    protected $table = 'community_roles';
    protected $primaryKey = 'community_roles_id';

    protected $fillable = [
        'role_name',
        'level_required',
        'description',
    ];

    public function communityMembers(): HasMany
    {
        return $this->hasMany(CommunityMember::class, 'role_id', 'community_roles_id');
    }

    public function communityJoinRequests(): HasMany
    {
        return $this->hasMany(CommunityJoinRequest::class, 'role_id', 'community_roles_id');
    }
}
