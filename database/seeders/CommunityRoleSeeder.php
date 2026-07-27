<?php

namespace Database\Seeders;

use App\Models\CommunityRole;
use Illuminate\Database\Seeder;

class CommunityRoleSeeder extends Seeder
{
    /**
     * Role internal komunitas. "Staff" ditambahkan sebagai peran bantuan
     * moderasi (approve member & review submission) tanpa hak membuat
     * Main Quest / Daily Mission / Challenge — bedanya dengan Ketua & Wakil
     * Ketua yang punya kewenangan penuh.
     */
    public function run(): void
    {
        $roles = [
            ['role_name' => 'Ketua', 'description' => 'Pemilik & pengelola utama komunitas.'],
            ['role_name' => 'Wakil Ketua', 'description' => 'Mendampingi Ketua mengelola komunitas.'],
            ['role_name' => 'Staff', 'description' => 'Membantu moderasi member & submission.'],
            ['role_name' => 'Member', 'description' => 'Anggota komunitas biasa.'],
        ];

        foreach ($roles as $role) {
            CommunityRole::updateOrCreate(['role_name' => $role['role_name']], $role);
        }
    }
}
