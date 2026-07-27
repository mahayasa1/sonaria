<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\MainQuest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MainQuestController extends Controller
{
    /**
     * 7 level main quest pada komunitas, diurutkan dan diberi status
     * unlocked/completed untuk user yang sedang login.
     */
    public function index(Request $request, Community $community): JsonResponse
    {
        $user = $request->user();

        $quests = $community->mainQuests()
            ->with(['materials.progress' => fn ($q) => $q->where('user_id', $user->users_id)])
            ->orderBy('level')
            ->get()
            ->map(function (MainQuest $quest) {
                $quest->setAttribute('is_completed', $this->isQuestCompleted($quest));

                return $quest;
            });

        return response()->json($quests);
    }

    public function show(MainQuest $mainQuest): JsonResponse
    {
        return response()->json(
            $mainQuest->load(['materials.files', 'materials.quizzes', 'materials.practices', 'community'])
        );
    }

    /**
     * Buat main quest baru. Hanya Ketua/Wakil Ketua. Level 1-7, xp_reward
     * wajib naik seiring level (aturan bisnis: level lebih tinggi = xp lebih besar).
     */
    public function store(Request $request, Community $community): JsonResponse
    {
        $this->authorize('manage', $community);

        $data = $request->validate([
            'level' => ['required', 'integer', 'min:1', 'max:7'],
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:255'],
            'xp_reward' => ['required', 'integer', 'min:0'],
            'point_reward' => ['nullable', 'integer', 'min:0'],
        ]);

        $exists = $community->mainQuests()->where('level', $data['level'])->exists();
        if ($exists) {
            throw ValidationException::withMessages([
                'level' => ["Main quest level {$data['level']} sudah ada di komunitas ini."],
            ]);
        }

        $previousQuest = $community->mainQuests()->where('level', '<', $data['level'])->orderByDesc('level')->first();
        if ($previousQuest && $data['xp_reward'] < (int) $previousQuest->xp_reward) {
            throw ValidationException::withMessages([
                'xp_reward' => ['XP reward harus lebih besar atau sama dengan level sebelumnya.'],
            ]);
        }

        $quest = $community->mainQuests()->create([
            ...$data,
            'created_by' => $request->user()->users_id,
            'status' => 'Draft',
        ]);

        return response()->json($quest, 201);
    }

    /**
     * Quest dianggap selesai jika seluruh materialnya sudah Completed
     * (progress material, quiz lulus, practice approved — dicek longgar
     * lewat status MaterialProgress untuk kesederhanaan MVP).
     */
    protected function isQuestCompleted(MainQuest $quest): bool
    {
        if ($quest->materials->isEmpty()) {
            return false;
        }

        return $quest->materials->every(function ($material) {
            $progress = $material->progress->first();

            return $progress && $progress->status === 'Completed';
        });
    }
}
