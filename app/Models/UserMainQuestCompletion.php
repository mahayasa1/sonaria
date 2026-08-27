<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserMainQuestCompletion extends Model
{
    use HasFactory;

    protected $table = 'user_main_quest_completions';
    protected $primaryKey = 'user_main_quest_completions_id';

    protected $fillable = [
        'user_id',
        'main_quest_id',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'users_id');
    }

    public function mainQuest(): BelongsTo
    {
        return $this->belongsTo(MainQuest::class, 'main_quest_id', 'main_quests_id');
    }
}
