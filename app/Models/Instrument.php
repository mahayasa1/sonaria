<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Instrument extends Model
{
    use HasFactory;

    protected $table = 'instruments';

    // Catatan: nama kolom PK "intruments_id" mengikuti dokumen sumber (typo asli).
    protected $primaryKey = 'intruments_id';

    protected $fillable = [
        'category_id',
        'name',
        'image',
        'description',
        'difficulty',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(MusicCategory::class, 'category_id', 'music_categories_id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'instrument_id', 'intruments_id');
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class, 'instrument_id', 'intruments_id');
    }

    public function challenges(): HasMany
    {
        return $this->hasMany(Challenge::class, 'instrument_id', 'intruments_id');
    }
}
