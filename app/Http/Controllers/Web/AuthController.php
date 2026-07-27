<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Level;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Auth berbasis session untuk aplikasi web (Inertia). Terpisah dari
 * App\Http\Controllers\Api\AuthController yang berbasis token Sanctum
 * (dipakai konsumen API/mobile terpisah).
 */
class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $user = Auth::user();

        if ($user->status !== 'Active') {
            Auth::logout();

            throw ValidationException::withMessages([
                'email' => ['Akun tidak aktif atau diblokir.'],
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    public function register(Request $request): RedirectResponse
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

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('landing');
    }
}
