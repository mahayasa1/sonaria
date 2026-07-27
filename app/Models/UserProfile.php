<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory;

    protected $table = 'user_profiles';
    protected $primaryKey = 'user_profiles_id';

    protected $fillable = [
        'user_id',
        'gender',
        'birth_date',
        'phone',
        'address',
        'province',
        'city',
        'profile_completed',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'profile_completed' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }
}
