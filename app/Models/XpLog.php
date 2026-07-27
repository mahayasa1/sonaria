<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class XpLog extends Model
{
    use HasFactory;

    protected $table = 'xp_logs';
    protected $primaryKey = 'xp_log_id';

    protected $fillable = [
        'user_id',
        'previous_level',
        'current_level',
        'total_xp',
        'level_up_at',
    ];

    protected $casts = [
        'level_up_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }
}
