<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialFile extends Model
{
    use HasFactory;

    protected $table = 'material_files';
    protected $primaryKey = 'material_files_id';

    protected $fillable = [
        'material_id',
        'file_type',
        'title',
        'file_name',
        'file_path',
        'duration',
        'file_size',
    ];

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class, 'material_id', 'materials_id');
    }
}
