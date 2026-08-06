<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    use EnsuresAdmin;

    public function index(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        return response()->json(
            Achievement::withCount('userAchievements')->orderByDesc('achievements_id')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:100'],
            'xp_reward' => ['required', 'integer', 'min:0'],
            'point_reward' => ['nullable', 'integer', 'min:0'],
        ]);

        $achievement = Achievement::create($data);

        return response()->json($achievement, 201);
    }

    public function update(Request $request, Achievement $achievement): JsonResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:100'],
            'xp_reward' => ['sometimes', 'integer', 'min:0'],
            'point_reward' => ['nullable', 'integer', 'min:0'],
        ]);

        $achievement->update($data);

        return response()->json($achievement);
    }

    public function destroy(Request $request, Achievement $achievement): JsonResponse
    {
        $this->ensureAdmin($request);

        if ($achievement->userAchievements()->exists()) {
            return response()->json([
                'message' => 'Achievement sudah dimiliki user, tidak bisa dihapus.',
            ], 422);
        }

        $achievement->delete();

        return response()->json(['message' => 'Achievement dihapus.']);
    }
}
