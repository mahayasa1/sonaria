<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MainQuest extends Model
{
    use HasFactory;

    protected $table = 'main_quests';
    protected $primaryKey = 'main_quests_id';

    protected $fillable = [
        'community_id',
        'created_by',
        'level',
        'title',
        'description',
        'xp_reward',
        'point_reward',
        'status',
    ];

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class, 'community_id', 'communities_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by', 'users_id');
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class, 'main_quest_id', 'main_quests_id');
    }

    /**
     * Quest dianggap selesai untuk seorang user hanya jika SEMUA material-nya
     * sudah Completed, SEMUA quiz di tiap material sudah pernah lulus, dan
     * SEMUA practice di tiap material sudah pernah Approved oleh reviewer.
     * Cukup satu attempt/submission lulus per quiz/practice (tidak harus yang
     * terakhir), tapi wajib ada untuk masing-masing.
     */
    public function isCompletedForUser(int $userId): bool
    {
        $materials = $this->materials()
            ->with([
                'progress' => fn ($q) => $q->where('user_id', $userId),
                'quizzes.attempts' => fn ($q) => $q->where('user_id', $userId)->where('is_passed', true),
                'practices.submissions' => fn ($q) => $q->where('user_id', $userId)->where('status', 'Approved'),
            ])
            ->get();

        if ($materials->isEmpty()) {
            return false;
        }

        return $materials->every(function (Material $material) {
            $progress = $material->progress->first();
            if (! $progress || $progress->status !== 'Completed') {
                return false;
            }

            $allQuizzesPassed = $material->quizzes->every(fn (Quiz $quiz) => $quiz->attempts->isNotEmpty());
            $allPracticesApproved = $material->practices->every(fn (Practice $practice) => $practice->submissions->isNotEmpty());

            return $allQuizzesPassed && $allPracticesApproved;
        });
    }
}
