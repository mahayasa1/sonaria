<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MusicCategory extends Model
{
    use HasFactory;

    protected $table = 'music_categories';
    protected $primaryKey = 'music_categories_id';

    protected $fillable = [
        'name',
        'icon',
        'description',
    ];

    public function instruments(): HasMany
    {
        return $this->hasMany(Instrument::class, 'category_id', 'music_categories_id');
    }

    public function communities(): HasMany
    {
        return $this->hasMany(Community::class, 'category_id', 'music_categories_id');
    }

    public function userCategoryPoints(): HasMany
    {
        return $this->hasMany(UserCategoryPoint::class, 'category_id', 'music_categories_id');
    }
}
