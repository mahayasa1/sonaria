<?php

namespace App\Http\Controllers\Api\Admin;

use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

trait EnsuresAdmin
{
    /**
     * Semua controller Api\Admin\* hanya boleh diakses user dengan role Admin.
     * abort(403) di route /api/* otomatis mengembalikan JSON karena apiFetch
     * selalu mengirim header Accept: application/json.
     */
    protected function ensureAdmin(Request $request): void
    {
        $user = $request->user();

        if (! $user || $user->role?->role_name !== 'Admin') {
            throw new HttpException(403, 'Khusus Admin.');
        }
    }
}
