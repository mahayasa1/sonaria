<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\Challenge;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ChallengeController extends Controller
{
    /**
     * Hanya ada 1 challenge aktif per komunitas.
     */
    public function index(Community $community): JsonResponse
    {
        $challenge = $community->challenges()
            ->where('status', 'Active')
            ->with('instrument')
            ->first();

        return response()->json($challenge);
    }

    public function show(Challenge $challenge): JsonResponse
    {
        return response()->json($challenge->load('instrument', 'community'));
    }

    /**
     * Buat challenge baru. Hanya Ketua/Wakil Ketua, dan hanya jika belum
     * ada challenge Active lain di komunitas ini.
     */
    public function store(Request $request, Community $community): JsonResponse
    {
        $this->authorize('manage', $community);

        $hasActive = $community->challenges()->where('status', 'Active')->exists();
        if ($hasActive) {
            throw ValidationException::withMessages([
                'status' => ['Komunitas ini sudah punya challenge yang sedang aktif.'],
            ]);
        }

        $data = $request->validate([
            'instrument_id' => ['required', 'exists:instruments,intruments_id'],
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:255'],
            'xp_reward' => ['required', 'integer', 'min:1'],
            'point_reward' => ['nullable', 'integer', 'min:0'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
        ]);

        $challenge = $community->challenges()->create([
            ...$data,
            'created_by' => $request->user()->users_id,
            'status' => 'Active',
        ]);

        return response()->json($challenge, 201);
    }

    /**
     * Tutup challenge yang sedang aktif. Hanya Ketua/Wakil Ketua. Setelah
     * ditutup, komunitas boleh buat challenge baru lagi (lihat validasi
     * "hasActive" di store()). Dipanggil dari tombol "Tutup Challenge" di
     * Manage/Challenges.tsx.
     */
    public function close(Request $request, Challenge $challenge): JsonResponse
    {
        $this->authorize('manage', $challenge->community);

        if ($challenge->status !== 'Active') {
            throw ValidationException::withMessages([
                'status' => ['Challenge ini tidak sedang aktif.'],
            ]);
        }

        $challenge->update(['status' => 'Closed']);

        return response()->json($challenge);
    }
}
