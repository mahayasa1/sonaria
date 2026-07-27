<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ForumComment extends Model
{
    use HasFactory;

    protected $table = 'forum_comments';
    protected $primaryKey = 'forum_comments_id';

    protected $fillable = [
        'post_id',
        'user_id',
        'parent_id',
        'comment',
        'status',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(ForumPost::class, 'post_id', 'forum_posts_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ForumComment::class, 'parent_id', 'forum_comments_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(ForumComment::class, 'parent_id', 'forum_comments_id');
    }
}
