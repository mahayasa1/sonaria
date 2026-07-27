<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['role_name' => 'Admin', 'description' => 'Administrator platform, akses penuh ke seluruh sistem.'],
            ['role_name' => 'Member', 'description' => 'Pengguna biasa Sonaria.'],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(['role_name' => $role['role_name']], $role);
        }
    }
}
