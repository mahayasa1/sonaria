<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserCategoryPoint extends Model
{
    use HasFactory;

    const UPDATED_AT = 'updated_at';
    const CREATED_AT = 'created_at';

    protected $table = 'user_category_points';
    protected $primaryKey = 'user_category_points_id';

    protected $fillable = [
        'user_id',
        'category_id',
        'total_xp',
        'total_point',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(MusicCategory::class, 'category_id', 'music_categories_id');
    }
}
