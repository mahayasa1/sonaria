<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Badge extends Model
{
    use HasFactory;

    protected $table = 'badges';
    protected $primaryKey = 'badges_id';

    protected $fillable = [
        'badge_name',
        'icon',
        'description',
        'xp_required',
        'point_required',
    ];

    public function userBadges(): HasMany
    {
        return $this->hasMany(UserBadge::class, 'badge_id', 'badges_id');
    }
}
