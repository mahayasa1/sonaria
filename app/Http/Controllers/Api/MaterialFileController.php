<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialFile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaterialFileController extends Controller
{
    /**
     * Tambah file (Video/PDF/Audio/Image) ke sebuah Learning Material.
     * Hanya Ketua/Wakil Ketua komunitas pemilik quest dari material tersebut.
     *
     * Catatan: mengikuti konvensi PracticeSubmissionController (video_path
     * sebagai string), yaitu file diunggah dahulu ke storage/CDN oleh
     * frontend, lalu path/nama filenya dikirim ke endpoint ini.
     */
    public function store(Request $request, Material $material): JsonResponse
    {
        $material->loadMissing('mainQuest.community');
        $this->authorize('manage', $material->mainQuest->community);

        $data = $request->validate([
            'file_type' => ['required', 'in:Video,PDF,Audio,Image'],
            'title' => ['required', 'string', 'max:150'],
            'file_name' => ['required', 'string', 'max:255'],
            'file_path' => ['required', 'string', 'max:255'],
            'duration' => ['nullable', 'string', 'max:11'],
            'file_size' => ['nullable', 'integer', 'min:0'],
        ]);

        $file = $material->files()->create($data);

        return response()->json($file, 201);
    }

    public function index(Material $material): JsonResponse
    {
        return response()->json($material->files()->latest()->get());
    }

    public function show(MaterialFile $materialFile): JsonResponse
    {
        return response()->json($materialFile);
    }

    /**
     * Update metadata file materi (misal ganti judul/duration setelah re-upload).
     */
    public function update(Request $request, MaterialFile $materialFile): JsonResponse
    {
        $materialFile->loadMissing('material.mainQuest.community');
        $this->authorize('manage', $materialFile->material->mainQuest->community);

        $data = $request->validate([
            'file_type' => ['sometimes', 'in:Video,PDF,Audio,Image'],
            'title' => ['sometimes', 'string', 'max:150'],
            'file_name' => ['sometimes', 'string', 'max:255'],
            'file_path' => ['sometimes', 'string', 'max:255'],
            'duration' => ['nullable', 'string', 'max:11'],
            'file_size' => ['nullable', 'integer', 'min:0'],
        ]);

        $materialFile->update($data);

        return response()->json($materialFile);
    }

    public function destroy(MaterialFile $materialFile): JsonResponse
    {
        $materialFile->loadMissing('material.mainQuest.community');
        $this->authorize('manage', $materialFile->material->mainQuest->community);

        $materialFile->delete();

        return response()->json(['message' => 'File materi dihapus.']);
    }
}
