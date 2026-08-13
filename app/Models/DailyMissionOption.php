<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyMissionOption extends Model
{
    use HasFactory;

    protected $table = 'daily_mission_options';
    protected $primaryKey = 'daily_mission_options_id';

    protected $fillable = [
        'question_id',
        'option_label',
        'option_text',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(DailyMissionQuestion::class, 'question_id', 'daily_mission_questions_id');
    }
}
