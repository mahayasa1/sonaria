<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Practice extends Model
{
    use HasFactory;

    protected $table = 'practices';
    protected $primaryKey = 'practices_id';

    protected $fillable = [
        'material_id',
        'title',
        'description',
        'minimum_score',
        'xp_reward',
        'point_reward',
        'deadline',
        'status',
    ];

    protected $casts = [
        'deadline' => 'datetime',
    ];

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class, 'material_id', 'materials_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(PracticeSubmission::class, 'practice_id', 'practices_id');
    }
}
