<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    use EnsuresAdmin;

    public function index(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        return response()->json(
            Role::withCount('users')->orderBy('role_name')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'role_name' => ['required', 'string', 'max:50', 'unique:roles,role_name'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $role = Role::create($data);

        return response()->json($role, 201);
    }

    public function update(Request $request, Role $role): JsonResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'role_name' => ['sometimes', 'string', 'max:50', 'unique:roles,role_name,'.$role->role_id.',role_id'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $role->update($data);

        return response()->json($role);
    }

    public function destroy(Request $request, Role $role): JsonResponse
    {
        $this->ensureAdmin($request);

        if ($role->users()->exists()) {
            return response()->json([
                'message' => 'Role masih dipakai oleh user, tidak bisa dihapus.',
            ], 422);
        }

        $role->delete();

        return response()->json(['message' => 'Role dihapus.']);
    }
}
