<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\CommunityJoinRequest;
use App\Models\CommunityMember;
use App\Models\CommunityRole;
use App\Models\Instrument;
use App\Models\MusicCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * 4 komunitas testing dengan kondisi berbeda:
 * - Komunitas Gitar Nusantara: komunitas utama, hierarki role lengkap
 *   (Ketua/Wakil Ketua/Staff/Member) + join request Pending.
 * - Drum Warrior Indonesia & Violin Harmony: komunitas aktif ukuran sedang.
 * - Brass Academy: sengaja dibuat kecil (Empty/Low Member) untuk menguji
 *   tampilan komunitas yang baru berdiri / sepi member.
 *
 * Catatan: komunitas sekarang di-filter berdasarkan instrument_id (bukan
 * cuma category_id) di halaman "Cari Komunitas", jadi setiap komunitas di
 * seeder ini wajib diisi instrument_id yang sesuai. Nama instrument mengikuti
 * persis InstrumentSeeder: "Gitar Akustik", "Drum Set", "Biola", "Trompet".
 */
class TestingCommunitySeeder extends Seeder
{
    public function run(): void
    {
        $ketuaRole = CommunityRole::where('role_name', 'Ketua')->firstOrFail();
        $wakilRole = CommunityRole::where('role_name', 'Wakil Ketua')->firstOrFail();
        $staffRole = CommunityRole::where('role_name', 'Staff')->firstOrFail();
        $memberRole = CommunityRole::where('role_name', 'Member')->firstOrFail();

        $categoryString = MusicCategory::where('name', 'String')->firstOrFail();
        $categoryPercussion = MusicCategory::where('name', 'Percussion')->firstOrFail();
        $categoryBrass = MusicCategory::where('name', 'Brass')->firstOrFail();

        $instrumentGitar = Instrument::where('name', 'Gitar Akustik')
            ->where('category_id', $categoryString->music_categories_id)
            ->firstOrFail();
        $instrumentDrum = Instrument::where('name', 'Drum Set')
            ->where('category_id', $categoryPercussion->music_categories_id)
            ->firstOrFail();
        $instrumentBiola = Instrument::where('name', 'Biola')
            ->where('category_id', $categoryString->music_categories_id)
            ->firstOrFail();
        $instrumentTrompet = Instrument::where('name', 'Trompet')
            ->where('category_id', $categoryBrass->music_categories_id)
            ->firstOrFail();

        $users = User::whereIn('username', [
            'ketua_gitar', 'wakil_gitar', 'staff_gitar', 'member_gitar', 'user_tempo', 'user_chord', 'user_pemula',
            'ketua_drum', 'member_drum', 'user_ritme', 'member_trompet',
            'ketua_biola', 'member_biola', 'user_melodi',
        ])->get()->keyBy('username');

        // 1. Komunitas Gitar Nusantara (komunitas utama, lengkap)
        $gitar = Community::updateOrCreate(
            ['community_name' => 'Komunitas Gitar Nusantara'],
            [
                'owner_id' => $users['ketua_gitar']->users_id,
                'category_id' => $categoryString->music_categories_id,
                'instrument_id' => $instrumentGitar->intruments_id,
                'description' => 'Wadah belajar gitar bareng, dari dasar sampai mahir.',
                'status' => 'Active',
            ]
        );

        $this->addMember($gitar, $users['ketua_gitar'], $ketuaRole);
        $this->addMember($gitar, $users['wakil_gitar'], $wakilRole);
        $this->addMember($gitar, $users['staff_gitar'], $staffRole);
        $this->addMember($gitar, $users['member_gitar'], $memberRole);
        $this->addMember($gitar, $users['user_tempo'], $memberRole);
        $this->addMember($gitar, $users['user_chord'], $memberRole);

        // Join request Pending: Raka belum diterima jadi member Gitar Nusantara.
        CommunityJoinRequest::updateOrCreate(
            ['community_id' => $gitar->communities_id, 'user_id' => $users['user_pemula']->users_id],
            ['role_id' => $memberRole->community_roles_id, 'join_date' => now()->subDays(2), 'status' => 'Pending']
        );

        // 2. Drum Warrior Indonesia
        $drum = Community::updateOrCreate(
            ['community_name' => 'Drum Warrior Indonesia'],
            [
                'owner_id' => $users['ketua_drum']->users_id,
                'category_id' => $categoryPercussion->music_categories_id,
                'instrument_id' => $instrumentDrum->intruments_id,
                'description' => 'Komunitas drummer dari segala genre, latihan ketukan bareng tiap minggu.',
                'status' => 'Active',
            ]
        );

        $this->addMember($drum, $users['ketua_drum'], $ketuaRole);
        $this->addMember($drum, $users['member_drum'], $memberRole);
        $this->addMember($drum, $users['user_ritme'], $memberRole);

        // Join request Removed (ditolak): Yoga sempat melamar ke Drum Warrior
        // sebelum akhirnya bergabung ke Brass Academy.
        CommunityJoinRequest::updateOrCreate(
            ['community_id' => $drum->communities_id, 'user_id' => $users['member_trompet']->users_id],
            ['role_id' => $memberRole->community_roles_id, 'join_date' => now()->subDays(10), 'status' => 'Removed']
        );

        // 3. Violin Harmony
        $violin = Community::updateOrCreate(
            ['community_name' => 'Violin Harmony'],
            [
                'owner_id' => $users['ketua_biola']->users_id,
                'category_id' => $categoryString->music_categories_id,
                'instrument_id' => $instrumentBiola->intruments_id,
                'description' => 'Komunitas pecinta biola klasik & kontemporer.',
                'status' => 'Active',
            ]
        );

        $this->addMember($violin, $users['ketua_biola'], $ketuaRole);
        $this->addMember($violin, $users['member_biola'], $memberRole);

        // Join request Pending: Citra masih menunggu persetujuan.
        CommunityJoinRequest::updateOrCreate(
            ['community_id' => $violin->communities_id, 'user_id' => $users['user_melodi']->users_id],
            ['role_id' => $memberRole->community_roles_id, 'join_date' => now()->subDay(), 'status' => 'Pending']
        );

        // 4. Brass Academy — sengaja dibuat kecil (Empty/Low Member state).
        // Dimiliki oleh ketua_gitar juga (satu user boleh punya lebih dari
        // satu komunitas) supaya kita tidak perlu menambah akun ketua baru
        // di luar daftar 15 akun testing resmi.
        $brass = Community::updateOrCreate(
            ['community_name' => 'Brass Academy'],
            [
                'owner_id' => $users['ketua_gitar']->users_id,
                'category_id' => $categoryBrass->music_categories_id,
                'instrument_id' => $instrumentTrompet->intruments_id,
                'description' => 'Komunitas alat tiup logam yang baru berdiri, masih sedikit member.',
                'status' => 'Active',
            ]
        );

        $this->addMember($brass, $users['ketua_gitar'], $ketuaRole);
        $this->addMember($brass, $users['member_trompet'], $memberRole);

        // Sinkronkan total_member setiap komunitas dengan jumlah member Active
        // sebenarnya (idempotent, aman dijalankan berkali-kali).
        foreach ([$gitar, $drum, $violin, $brass] as $community) {
            $community->update([
                'total_member' => $community->members()->where('status', 'Active')->count(),
            ]);
        }
    }

    protected function addMember(Community $community, User $user, CommunityRole $role): void
    {
        CommunityMember::updateOrCreate(
            ['community_id' => $community->communities_id, 'user_id' => $user->users_id],
            [
                'role_id' => $role->community_roles_id,
                'join_date' => now()->subDays(30),
                'status' => 'Active',
            ]
        );

        // Owner dibuat langsung sebagai Ketua tanpa join request (meniru alur
        // CommunityController::store). Member lain dianggap sudah melalui
        // alur join+approve, jadi kita catat juga join request-nya sebagai
        // Active (approved) supaya riwayatnya konsisten.
        if ($role->role_name !== 'Ketua') {
            CommunityJoinRequest::updateOrCreate(
                ['community_id' => $community->communities_id, 'user_id' => $user->users_id],
                [
                    'role_id' => CommunityRole::where('role_name', 'Member')->value('community_roles_id'),
                    'join_date' => now()->subDays(30),
                    'status' => 'Active',
                ]
            );
        }
    }
}