<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MainQuest;
use App\Models\Material;
use App\Models\MaterialProgress;
use App\Services\GamificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MaterialController extends Controller
{
    public function __construct(protected GamificationService $gamification)
    {
    }

    /**
     * Tambah Learning Material baru ke sebuah birama Main Quest.
     * Hanya Ketua/Wakil Ketua komunitas pemilik quest tersebut.
     */
    public function store(Request $request, MainQuest $mainQuest): JsonResponse
    {
        $this->authorize('manage', $mainQuest->community);

        $data = $request->validate([
            'instrument_id' => ['required', 'exists:instruments,intruments_id'],
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:255'],
            'difficulty' => ['required', 'in:Easy,Medium,Hard'],
            'estimated_time' => ['nullable', 'integer', 'min:0'],
            'order_number' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'in:Draft,Published'],
        ]);

        $slug = Str::slug($data['title']);
        $suffix = 1;
        $uniqueSlug = $slug;
        while (Material::where('slug', $uniqueSlug)->exists()) {
            $uniqueSlug = "{$slug}-".(++$suffix);
        }

        $material = Material::create([
            ...$data,
            'main_quest_id' => $mainQuest->main_quests_id,
            'slug' => $uniqueSlug,
            'status' => $data['status'] ?? 'Draft',
        ]);

        return response()->json($material, 201);
    }

    public function show(Request $request, Material $material): JsonResponse
    {
        $user = $request->user();

        $material->load(['files', 'quizzes', 'practices', 'instrument']);
        $progress = MaterialProgress::where('material_id', $material->materials_id)
            ->where('user_id', $user->users_id)
            ->first();

        return response()->json([
            'material' => $material,
            'progress' => $progress,
        ]);
    }

    /**
     * Update progress belajar user pada materi ini (dipanggil dari video/PDF player di frontend).
     */
    public function updateProgress(Request $request, Material $material): JsonResponse
    {
        $data = $request->validate([
            'progress_percentage' => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        $user = $request->user();

        $progress = MaterialProgress::firstOrNew([
            'material_id' => $material->materials_id,
            'user_id' => $user->users_id,
        ]);

        $isFirstAccess = ! $progress->exists;
        $progress->progress_percentage = $data['progress_percentage'];
        $progress->status = $data['progress_percentage'] >= 100 ? 'Completed' : 'In Progress';
        $progress->last_access_at = now();

        if ($isFirstAccess) {
            $progress->started_at = now();
        }

        if ($progress->status === 'Completed' && ! $progress->completed_at) {
            $progress->completed_at = now();
        }

        $progress->save();

        if ($progress->status === 'Completed') {
            $this->gamification->checkMainQuestCompletion($user, $material->mainQuest);
        }

        return response()->json($progress);
    }
}
