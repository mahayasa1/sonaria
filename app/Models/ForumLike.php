<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ForumLike extends Model
{
    use HasFactory;

    protected $table = 'forum_likes';
    protected $primaryKey = 'forum_likes_id';

    protected $fillable = [
        'post_id',
        'user_id',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(ForumPost::class, 'post_id', 'forum_posts_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }
}
