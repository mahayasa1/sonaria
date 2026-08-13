<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MusicCategory;
use App\Models\Instrument;
use App\Models\Community;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    /**
     * 4 kategori tetap: Percussion, Woodwind, Brass, String.
     */
    public function categories(): JsonResponse
    {
        return response()->json(MusicCategory::orderBy('name')->get());
    }

    /**
     * Daftar instrument berdasarkan kategori yang dipilih.
     */
    public function instruments(MusicCategory $category): JsonResponse
    {
        return response()->json(
            $category->instruments()->orderBy('name')->get()
        );
    }

    /**
     * Simpan pilihan instrument user (menandai onboarding selesai).
     */
    public function selectInstrument(Request $request)
    {
        $validated = $request->validate([
            'instrument_id' => ['required', 'integer', 'exists:instruments,intruments_id'],
        ]);

        $instrument = Instrument::findOrFail($validated['instrument_id']);

        $request->user()->update(['instrument_id' => $instrument->intruments_id]);

        $matchingCommunities = Community::where('music_categories_id', $instrument->music_categories_id)
            ->where('is_active', true)
            ->get(['communities_id', 'community_name']);

        return response()->json([
            'message' => 'Instrument berhasil disimpan.',
            'instrument' => $instrument,
            'redirect' => $matchingCommunities->count() === 1
                ? route('communities.show', $matchingCommunities->first())
                : route('communities.index', ['category_id' => $instrument->music_categories_id]),
        ]);
    }
}
