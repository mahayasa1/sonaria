<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BadgeController extends Controller
{
    use EnsuresAdmin;

    public function index(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        return response()->json(
            Badge::withCount('userBadges')->orderByDesc('badges_id')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'badge_name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:100'],
            'xp_required' => ['nullable', 'integer', 'min:0'],
            'point_required' => ['nullable', 'integer', 'min:0'],
        ]);

        $badge = Badge::create($data);

        return response()->json($badge, 201);
    }

    public function update(Request $request, Badge $badge): JsonResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'badge_name' => ['sometimes', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:100'],
            'xp_required' => ['nullable', 'integer', 'min:0'],
            'point_required' => ['nullable', 'integer', 'min:0'],
        ]);

        $badge->update($data);

        return response()->json($badge);
    }

    public function destroy(Request $request, Badge $badge): JsonResponse
    {
        $this->ensureAdmin($request);

        if ($badge->userBadges()->exists()) {
            return response()->json([
                'message' => 'Badge sudah dimiliki user, tidak bisa dihapus.',
            ], 422);
        }

        $badge->delete();

        return response()->json(['message' => 'Badge dihapus.']);
    }
}
