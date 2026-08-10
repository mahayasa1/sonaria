<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Minimal 30 notifikasi tersebar di seluruh tipe enum ('Main Quest', 'Quiz',
 * 'Practice', 'Daily Mission', 'Challenge', 'Forum', 'System') dengan
 * campuran is_read true/false. Dibungkus guard count() supaya idempotent
 * (tidak menggandakan data kalau seeder dijalankan ulang).
 */
class TestingNotificationSeeder extends Seeder
{
    public function run(): void
    {
        if (Notification::count() >= 30) {
            return;
        }

        // username => list of [type, title, message, is_read]
        $plan = [
            'member_gitar' => [
                ['Practice', 'Latihan Disetujui', 'Practice submission "Latihan Posisi Jari" kamu sudah Approved, mantap!', true],
                ['Quiz', 'Quiz Lulus', 'Selamat, kamu lulus Quiz: Video Pengantar: Mengenal Gitar dan Senar dengan skor 80.', true],
                ['Challenge', 'Challenge Disetujui', 'Submission challenge "Cover Lagu Daerah Favoritmu" kamu Approved dengan skor 92.', false],
                ['Main Quest', 'Naik Level!', 'Selamat, level kamu sekarang naik berkat reward challenge terbaru.', false],
                ['Forum', 'Komentar Baru', 'Ada balasan baru di post forum kamu "Progress Latihan Fingerstyle Minggu Ini".', false],
            ],
            'user_tempo' => [
                ['Practice', 'Latihan Perlu Revisi', 'Practice submission "Latihan Posisi Jari" kamu perlu Revision, cek feedback reviewer.', false],
                ['Quiz', 'Quiz Belum Lulus', 'Skor Quiz: Video Pengantar: Mengenal Gitar dan Senar kamu belum mencapai passing score.', true],
                ['Daily Mission', 'Progress Daily Mission', 'Progress Daily Mission "Kuis Harian: Pemanasan" kamu 40%, lanjutkan!', false],
            ],
            'user_chord' => [
                ['Practice', 'Latihan Ditolak', 'Practice submission "Latihan Posisi Jari" kamu Rejected, silakan coba lagi.', true],
                ['Quiz', 'Quiz Belum Lulus', 'Skor Quiz: Video Pengantar: Mengenal Gitar dan Senar kamu belum mencapai passing score.', false],
                ['Challenge', 'Challenge Ditolak', 'Submission challenge "Cover Lagu Daerah Favoritmu" kamu Rejected.', true],
            ],
            'user_pemula' => [
                ['System', 'Permintaan Gabung Terkirim', 'Permintaan gabung ke Komunitas Gitar Nusantara sudah dikirim, tunggu persetujuan Ketua.', false],
                ['Challenge', 'Submission Diterima', 'Submission challenge "Cover Lagu Daerah Favoritmu" kamu sedang direview.', false],
            ],
            'wakil_gitar' => [
                ['Main Quest', 'Quest Level 1 Selesai', 'Selamat, kamu menuntaskan Main Quest level 1 "Mengenal Gitar dan Senar".', true],
                ['Practice', 'Submission Baru Menunggu Review', 'Ada submission practice baru dari Aditya yang menunggu direview.', false],
                ['Daily Mission', 'Reward Diklaim', 'Reward Daily Mission "Kuis Harian: Pemanasan" berhasil diklaim.', true],
            ],
            'staff_gitar' => [
                ['Practice', 'Submission Kamu Belum Direview', 'Practice submission "Latihan Posisi Jari" kamu masih menunggu review.', false],
                ['Challenge', 'Challenge Kamu Disetujui', 'Submission practice "Latihan Strumming" kamu Approved dengan skor 88.', true],
            ],
            'ketua_gitar' => [
                ['System', 'Permintaan Gabung Baru', 'Raka mengajukan permintaan bergabung ke Komunitas Gitar Nusantara.', false],
                ['Forum', 'Post Baru di Komunitasmu', 'Ada post baru dari member di Komunitas Gitar Nusantara.', true],
                ['Main Quest', 'Level Maksimum', 'Kamu sudah berada di level tertinggi, Konduktor!', true],
            ],
            'ketua_drum' => [
                ['Practice', 'Submission Disetujui', 'Practice submission Nanda "Latihan Ketukan Dasar" sudah kamu Approve.', true],
                ['Challenge', 'Submission Baru', 'Nanda mengirim submission untuk Rhythm Master Challenge.', false],
                ['Main Quest', 'Quest Level 1 Selesai', 'Selamat, kamu menuntaskan Main Quest level 1 "Mengenal Drum Set".', true],
            ],
            'member_drum' => [
                ['Practice', 'Latihan Disetujui', 'Practice submission "Latihan Ketukan Dasar" kamu sudah Approved.', true],
                ['Quiz', 'Quiz Belum Lulus', 'Skor Quiz: Video Pengantar: Mengenal Drum Set kamu belum mencapai passing score.', false],
                ['Challenge', 'Perlu Revisi', 'Submission Rhythm Master Challenge kamu perlu Revision.', false],
            ],
            'ketua_biola' => [
                ['Main Quest', 'Quest Level 1 Selesai', 'Selamat, kamu menuntaskan Main Quest level 1 "Mengenal Biola dan Bow".', true],
                ['System', 'Permintaan Gabung Baru', 'Citra mengajukan permintaan bergabung ke Violin Harmony.', false],
            ],
            'member_biola' => [
                ['Practice', 'Submission Sedang Direview', 'Practice submission "Latihan Bowing Dasar" kamu sedang menunggu review.', false],
                ['Challenge', 'Challenge Disetujui', 'Submission Violin Performance Challenge kamu Approved dengan skor 95.', true],
            ],
            'member_trompet' => [
                ['Quiz', 'Quiz Lulus', 'Selamat, kamu lulus Quiz: Video Pengantar: Mengenal Alat Tiup Logam dengan skor 80.', true],
                ['Practice', 'Latihan Disetujui', 'Practice submission "Latihan Embouchure Dasar" kamu sudah Approved.', false],
            ],
        ];

        foreach ($plan as $username => $notifications) {
            $user = User::where('username', $username)->first();

            if (! $user) {
                continue;
            }

            foreach ($notifications as $index => [$type, $title, $message, $isRead]) {
                Notification::updateOrCreate(
                    ['user_id' => $user->users_id, 'title' => $title, 'type' => $type],
                    [
                        'message' => $message,
                        'is_read' => $isRead,
                        'read_at' => $isRead ? now()->subHours($index + 1) : null,
                        'created_at' => now()->subDays(7)->addHours($index),
                    ]
                );
            }
        }
    }
}
