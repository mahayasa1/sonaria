<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Level;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register akun baru. Role & Level di-set ke default (Member, Level 1).
     */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:50', 'unique:users,username'],
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:100', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $defaultRole = Role::where('role_name', 'Member')->first();
        $defaultLevel = Level::orderBy('min_xp')->first();

        $user = User::create([
            'role_id' => $defaultRole?->role_id,
            'level_id' => $defaultLevel?->level_id,
            'username' => $data['username'],
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'total_xp' => 0,
            'total_point' => 0,
            'status' => 'Active',
        ]);

        $token = $user->createToken('sonaria')->plainTextToken;

        return response()->json([
            'user' => $user->load('role', 'level'),
            'token' => $token,
            // Beritahu frontend untuk arahkan ke halaman pilih kategori alat musik
            'next_step' => 'select-instrument-category',
        ], 201);
    }

    /**
     * Login. Redirect target ditentukan frontend berdasarkan instrument_id user.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        if ($user->status !== 'Active') {
            throw ValidationException::withMessages([
                'email' => ['Akun tidak aktif atau diblokir.'],
            ]);
        }

        $token = $user->createToken('sonaria')->plainTextToken;

        return response()->json([
            'user' => $user->load('role', 'level', 'instrument'),
            'token' => $token,
            'next_step' => $user->instrument_id ? 'browse-community' : 'select-instrument-category',
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Berhasil logout.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->load('role', 'level', 'instrument.category', 'profile')
        );
    }
}
