<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialProgress extends Model
{
    use HasFactory;

    protected $table = 'material_progress';
    protected $primaryKey = 'material_progress_id';

    protected $fillable = [
        'user_id',
        'material_id',
        'progress_percentage',
        'status',
        'started_at',
        'completed_at',
        'last_access_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'last_access_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class, 'material_id', 'materials_id');
    }
}
