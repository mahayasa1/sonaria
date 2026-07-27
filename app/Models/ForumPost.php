<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ForumPost extends Model
{
    use HasFactory;

    protected $table = 'forum_posts';
    protected $primaryKey = 'forum_posts_id';

    protected $fillable = [
        'community_id',
        'user_id',
        'title',
        'content',
        'image',
        'total_like',
        'total_comment',
        'status',
    ];

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class, 'community_id', 'communities_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ForumComment::class, 'post_id', 'forum_posts_id');
    }

    public function likes(): HasMany
    {
        return $this->hasMany(ForumLike::class, 'post_id', 'forum_posts_id');
    }
}
