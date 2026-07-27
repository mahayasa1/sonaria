<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Instrument;
use App\Models\MusicCategory;
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
    public function selectInstrument(Request $request): JsonResponse
    {
        $data = $request->validate([
            'instrument_id' => ['required', 'exists:instruments,intruments_id'],
        ]);

        $user = $request->user();
        $user->instrument_id = $data['instrument_id'];
        $user->save();

        return response()->json([
            'user' => $user->fresh()->load('instrument.category'),
            'next_step' => 'browse-community',
        ]);
    }
}
