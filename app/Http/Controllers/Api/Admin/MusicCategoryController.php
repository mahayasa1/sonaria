<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MusicCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MusicCategoryController extends Controller
{
    use EnsuresAdmin;

    public function index(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        return response()->json(
            MusicCategory::withCount(['instruments', 'communities'])
                ->with('instruments')
                ->orderBy('name')
                ->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:music_categories,name'],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:100'],
        ]);

        $category = MusicCategory::create($data);

        return response()->json($category, 201);
    }

    public function update(Request $request, MusicCategory $category): JsonResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:100', 'unique:music_categories,name,'.$category->music_categories_id.',music_categories_id'],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:100'],
        ]);

        $category->update($data);

        return response()->json($category);
    }

    public function destroy(Request $request, MusicCategory $category): JsonResponse
    {
        $this->ensureAdmin($request);

        if ($category->instruments()->exists() || $category->communities()->exists()) {
            return response()->json([
                'message' => 'Kategori masih dipakai instrument/komunitas, tidak bisa dihapus.',
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Kategori dihapus.']);
    }

    /**
     * Instrument dalam kategori ini (dipakai form Admin/Categories yang
     * sudah punya bagian "instrument per kategori").
     */
    public function storeInstrument(Request $request, MusicCategory $category): JsonResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:255'],
            'difficulty' => ['nullable', 'in:Easy,Medium,Hard'],
        ]);

        $instrument = $category->instruments()->create($data);

        return response()->json($instrument, 201);
    }

    public function destroyInstrument(Request $request, \App\Models\Instrument $instrument): JsonResponse
    {
        $this->ensureAdmin($request);

        if ($instrument->users()->exists() || $instrument->materials()->exists() || $instrument->challenges()->exists()) {
            return response()->json([
                'message' => 'Instrument masih dipakai, tidak bisa dihapus.',
            ], 422);
        }

        $instrument->delete();

        return response()->json(['message' => 'Instrument dihapus.']);
    }
}
