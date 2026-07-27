<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
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

        return response()->json($progress);
    }
}
