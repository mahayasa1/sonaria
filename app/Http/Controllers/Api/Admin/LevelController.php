<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Level;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LevelController extends Controller
{
    use EnsuresAdmin;

    public function index(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        return response()->json(
            Level::withCount('users')->orderBy('level')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'level' => ['required', 'integer', 'min:1', 'unique:levels,level'],
            'title' => ['required', 'string', 'max:100'],
            'min_xp' => ['required', 'integer', 'min:0'],
            'max_xp' => ['nullable', 'integer', 'gte:min_xp'],
            'icon' => ['nullable', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:20'],
            'can_create_community' => ['boolean'],
        ]);

        $level = Level::create($data);

        return response()->json($level, 201);
    }

    public function update(Request $request, Level $level): JsonResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'level' => ['sometimes', 'integer', 'min:1', 'unique:levels,level,'.$level->level_id.',level_id'],
            'title' => ['sometimes', 'string', 'max:100'],
            'min_xp' => ['sometimes', 'integer', 'min:0'],
            'max_xp' => ['nullable', 'integer', 'gte:min_xp'],
            'icon' => ['nullable', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:20'],
            'can_create_community' => ['boolean'],
        ]);

        $level->update($data);

        return response()->json($level);
    }

    public function destroy(Request $request, Level $level): JsonResponse
    {
        $this->ensureAdmin($request);

        if ($level->users()->exists()) {
            return response()->json([
                'message' => 'Level masih dipakai oleh user, tidak bisa dihapus.',
            ], 422);
        }

        $level->delete();

        return response()->json(['message' => 'Level dihapus.']);
    }
}
