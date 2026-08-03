<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Practice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PracticeController extends Controller
{
    /**
     * Tambah misi video latihan (Practice) baru ke sebuah Learning Material.
     */
    public function store(Request $request, Material $material): JsonResponse
    {
        $material->loadMissing('mainQuest.community');
        $this->authorize('manage', $material->mainQuest->community);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:255'],
            'minimum_score' => ['nullable', 'integer', 'min:0', 'max:100'],
            'xp_reward' => ['required', 'integer', 'min:0'],
            'point_reward' => ['nullable', 'integer', 'min:0'],
            'deadline' => ['nullable', 'date'],
            'status' => ['nullable', 'in:Active,Inactive'],
        ]);

        $practice = Practice::create([
            ...$data,
            'material_id' => $material->materials_id,
            'status' => $data['status'] ?? 'Active',
        ]);

        return response()->json($practice, 201);
    }

    public function show(Request $request, Practice $practice): JsonResponse
    {
        $user = $request->user();

        $practice->load('material');
        $mySubmission = $practice->submissions()
            ->where('user_id', $user->users_id)
            ->latest('submitted_at')
            ->first();

        return response()->json([
            'practice' => $practice,
            'my_submission' => $mySubmission,
        ]);
    }
}
