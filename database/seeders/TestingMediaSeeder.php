<?php

namespace Database\Seeders;

use App\Models\MediaFile;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Metadata media_files (avatar, banner komunitas, gambar soal quiz, dsb).
 * Tidak perlu file fisik di storage karena aplikasi hanya menyimpan path-nya
 * saja; ini murni untuk menguji tampilan daftar/manajemen media file.
 */
class TestingMediaSeeder extends Seeder
{
    public function run(): void
    {
        // username => [file_name, original_name, file_type, mime_type, size, extension, is_public]
        $plan = [
            'ketua_gitar' => ['avatar-salsa.jpg', 'foto-profil-salsa.jpg', 'Image', 'image/jpeg', 350_000, 'jpg', true],
            'ketua_drum' => ['avatar-kevin.jpg', 'foto-profil-kevin.jpg', 'Image', 'image/jpeg', 310_000, 'jpg', true],
            'ketua_biola' => ['avatar-melodi.jpg', 'foto-profil-melodi.jpg', 'Image', 'image/jpeg', 290_000, 'jpg', true],
            'member_gitar' => ['avatar-aditya.jpg', 'foto-profil-aditya.jpg', 'Image', 'image/jpeg', 280_000, 'jpg', true],
        ];

        foreach ($plan as $username => [$fileName, $originalName, $fileType, $mime, $size, $ext, $isPublic]) {
            $user = User::where('username', $username)->firstOrFail();

            MediaFile::updateOrCreate(
                ['uploaded_by' => $user->users_id, 'file_name' => $fileName],
                [
                    'original_name' => $originalName,
                    'file_type' => $fileType,
                    'mime_type' => $mime,
                    'file_size' => $size,
                    'file_path' => "avatars/{$fileName}",
                    'file_extension' => $ext,
                    'is_public' => $isPublic,
                ]
            );
        }

        // Banner komunitas (dokumen non-privat) diupload oleh masing-masing Ketua.
        $bannerPlan = [
            'ketua_gitar' => 'banner-gitar-nusantara.png',
            'ketua_drum' => 'banner-drum-warrior.png',
            'ketua_biola' => 'banner-violin-harmony.png',
        ];

        foreach ($bannerPlan as $username => $fileName) {
            $user = User::where('username', $username)->firstOrFail();

            MediaFile::updateOrCreate(
                ['uploaded_by' => $user->users_id, 'file_name' => $fileName],
                [
                    'original_name' => $fileName,
                    'file_type' => 'Image',
                    'mime_type' => 'image/png',
                    'file_size' => 620_000,
                    'file_path' => "communities/banners/{$fileName}",
                    'file_extension' => 'png',
                    'is_public' => true,
                ]
            );
        }

        // Satu contoh file privat (dokumen internal, tidak untuk publik).
        $admin = User::where('username', 'admin_sonaria')->firstOrFail();

        MediaFile::updateOrCreate(
            ['uploaded_by' => $admin->users_id, 'file_name' => 'catatan-internal-review.pdf'],
            [
                'original_name' => 'catatan-internal-review.pdf',
                'file_type' => 'PDF',
                'mime_type' => 'application/pdf',
                'file_size' => 150_000,
                'file_path' => 'internal/catatan-internal-review.pdf',
                'file_extension' => 'pdf',
                'is_public' => false,
            ]
        );
    }
}
