<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

// Catatan: ini model kustom untuk tabel "notifications" milik Sonaria (bukan
// tabel notifications bawaan Illuminate\Notifications). Namespace App\Models
// sehingga tidak bentrok dengan sistem notifikasi native Laravel jika suatu
// saat dipakai bersamaan.
class Notification extends Model
{
    use HasFactory;

    protected $table = 'notifications';
    protected $primaryKey = 'notifications_id';

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'reference_type',
        'reference_id',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }

    public function reference(): MorphTo
    {
        return $this->morphTo(__FUNCTION__, 'reference_type', 'reference_id');
    }
}
