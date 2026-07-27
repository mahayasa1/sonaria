<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Material extends Model
{
    use HasFactory;

    protected $table = 'materials';
    protected $primaryKey = 'materials_id';

    protected $fillable = [
        'main_quest_id',
        'instrument_id',
        'title',
        'slug',
        'description',
        'difficulty',
        'estimated_time',
        'order_number',
        'thumbnail',
        'status',
    ];

    public function mainQuest(): BelongsTo
    {
        return $this->belongsTo(MainQuest::class, 'main_quest_id', 'main_quests_id');
    }

    public function instrument(): BelongsTo
    {
        return $this->belongsTo(Instrument::class, 'instrument_id', 'intruments_id');
    }

    public function files(): HasMany
    {
        return $this->hasMany(MaterialFile::class, 'material_id', 'materials_id');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(MaterialProgress::class, 'material_id', 'materials_id');
    }

    public function practices(): HasMany
    {
        return $this->hasMany(Practice::class, 'material_id', 'materials_id');
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class, 'material_id', 'materials_id');
    }
}
