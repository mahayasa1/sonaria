<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $table = 'activity_logs';
    protected $primaryKey = 'activity_logs_id';

    protected $fillable = [
        'user_id',
        'activity',
        'module',
        'description',
        'ip_address',
        'device',
        'browser',
        'operating_system',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }
}
