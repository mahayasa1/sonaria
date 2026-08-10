<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\ForumComment;
use App\Models\ForumLike;
use App\Models\ForumPost;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Forum: minimal 15 post, 30 komentar/reply (nested via parent_id), 50 like.
 * total_like/total_comment pada tiap post disinkronkan ulang di akhir supaya
 * selalu konsisten dengan jumlah baris sebenarnya, aman dijalankan berkali-kali.
 */
class TestingForumSeeder extends Seeder
{
    /**
     * community_name => list of [username, title, content, status]
     *
     * @var array<string, array<int, array{0: string, 1: string, 2: string, 3: string}>>
     */
    protected array $postPlan = [
        'Komunitas Gitar Nusantara' => [
            ['ketua_gitar', 'Selamat Datang di Komunitas Gitar Nusantara!', 'Halo semua, yuk mulai belajar gitar bareng dari dasar sampai mahir. Jangan sungkan bertanya di sini ya.', 'Published'],
            ['wakil_gitar', 'Tips Merawat Senar Gitar Akustik', 'Senar yang berkarat bikin suara jadi kusam. Lap senar setelah main dan simpan gitar di tempat yang tidak lembap.', 'Published'],
            ['staff_gitar', 'Rekomendasi Aplikasi Tuner Gitar', 'Aku pakai aplikasi tuner gratisan, akurat kok buat pemula. Ada yang punya rekomendasi lain?', 'Published'],
            ['member_gitar', 'Progress Latihan Fingerstyle Minggu Ini', 'Akhirnya bisa mainin lagu pertama pakai teknik fingerstyle! Seneng banget rasanya.', 'Published'],
            ['user_tempo', 'Susah Banget Perpindahan Chord :(', 'Ada tips supaya perpindahan chord G ke C lebih halus? Jari aku masih suka nyangkut.', 'Published'],
            ['user_chord', 'Sharing: Playlist Lagu untuk Latihan Strumming', 'Ini playlist lagu-lagu gampang buat latihan strumming pola down-up.', 'Published'],
            ['member_gitar', 'Post lama yang sudah tidak relevan', 'Post ini sengaja disembunyikan untuk menguji status Hidden.', 'Hidden'],
            ['user_tempo', 'Post yang dihapus penulisnya', 'Post ini sengaja dihapus untuk menguji status Deleted.', 'Deleted'],
        ],
        'Drum Warrior Indonesia' => [
            ['ketua_drum', 'Selamat Datang, Drummer Nusantara!', 'Yuk saling sharing groove dan teknik drum di sini.', 'Published'],
            ['member_drum', 'Double Pedal Masih Kaku', 'Ada saran latihan supaya kaki kanan-kiri lebih seimbang mainin double pedal?', 'Published'],
            ['user_ritme', 'Review Stick Drum Murah tapi Awet', 'Habis coba beberapa merk stick, ini rekomendasiku buat pemula.', 'Published'],
        ],
        'Violin Harmony' => [
            ['ketua_biola', 'Selamat Datang di Violin Harmony', 'Komunitas ini terbuka untuk semua level, dari pemula sampai yang sudah lama main biola.', 'Published'],
            ['member_biola', 'Vibrato Masih Kaku, Ada Tips?', 'Latihan vibrato tiap hari tapi masih kedengeran kaku, mohon sarannya.', 'Published'],
        ],
        'Brass Academy' => [
            ['ketua_gitar', 'Selamat Datang di Brass Academy', 'Komunitas ini baru dibentuk, yuk ramaikan dengan sharing pengalaman main alat tiup logam.', 'Published'],
            ['member_trompet', 'Embouchure Cepat Capek, Wajar Nggak?', 'Baru belajar trompet, bibir cepat capek kalau tiup lama. Apa ini normal buat pemula?', 'Published'],
        ],
    ];

    /**
     * community_name => list of [post_index (0-based), username, comment, parent_index|null]
     * parent_index merujuk ke index komentar lain DALAM LIST YANG SAMA (0-based)
     * untuk membuat reply bertingkat.
     *
     * @var array<string, array<int, array{0: int, 1: string, 2: string, 3: int|null}>>
     */
    protected array $commentPlan = [
        'Komunitas Gitar Nusantara' => [
            [0, 'member_gitar', 'Makasih kak, semangat belajar bareng!', null],
            [0, 'user_tempo', 'Izin gabung juga ya kak 🙌', null],
            [0, 'user_chord', 'Komunitasnya ramah banget, betah di sini.', null],
            [1, 'member_gitar', 'Wah baru tau, makasih tipsnya!', null],
            [1, 'user_chord', 'Bener banget, punyaku dulu jadi kusam gara-gara lembap.', null],
            [1, 'staff_gitar', 'Sama-sama, semoga membantu ya!', 3],
            [2, 'user_tempo', 'Aku pakai aplikasi yang sama, lumayan akurat.', null],
            [2, 'wakil_gitar', 'Ada juga versi berbayar yang fiturnya lebih lengkap.', null],
            [3, 'user_chord', 'Keren! Boleh dong tutorialnya di-share.', null],
            [3, 'wakil_gitar', 'Mantap progressnya, lanjutkan!', null],
            [4, 'member_gitar', 'Coba pelan-pelan dulu tanpa strumming, fokus posisi jari.', null],
            [4, 'staff_gitar', 'Setuju, aku juga gitu waktu belajar dulu.', 10],
            [4, 'user_chord', 'Makasih sarannya, aku coba ya!', 10],
            [5, 'ketua_gitar', 'Playlist bagus, aku save ya buat referensi kelas berikutnya.', null],
            [5, 'wakil_gitar', 'Beberapa lagu di sini juga aku pakai buat materi latihan.', 13],
        ],
        'Drum Warrior Indonesia' => [
            [0, 'member_drum', 'Siap ketua, semangat!', null],
            [0, 'user_ritme', 'Salam kenal semua!', null],
            [1, 'ketua_drum', 'Coba latihan metronome pelan dulu, baru naikin tempo bertahap.', null],
            [1, 'user_ritme', 'Setuju, itu yang aku lakuin juga.', 2],
            [1, 'member_drum', 'Makasih ketua, langsung dicoba!', 2],
            [2, 'member_drum', 'Noted, makasih rekomendasinya!', null],
            [2, 'ketua_drum', 'Mantap, nanti aku coba juga.', 5],
        ],
        'Violin Harmony' => [
            [0, 'member_biola', 'Terima kasih ketua, senang bisa gabung!', null],
            [0, 'ketua_biola', 'Sama-sama, semangat berlatih ya!', 0],
            [1, 'ketua_biola', 'Coba latihan vibrato di senar kosong dulu pelan-pelan.', null],
            [1, 'ketua_biola', 'Konsistensi latihan tiap hari juga penting meski cuma 10 menit.', 2],
            [1, 'member_biola', 'Siap kak, makasih banyak masukannya!', 2],
        ],
        'Brass Academy' => [
            [0, 'member_trompet', 'Siap, semangat membangun komunitas ini!', null],
            [1, 'ketua_gitar', 'Wajar kok di awal, embouchure butuh waktu untuk terbiasa.', null],
            [1, 'member_trompet', 'Lega dengernya, makasih kak!', 1],
        ],
    ];

    /**
     * community_name => list of post_index yang di-like beserta usernamenya.
     *
     * @var array<string, array<int, array{0: int, 1: string}>>
     */
    protected array $likePlan = [
        'Komunitas Gitar Nusantara' => [
            [0, 'wakil_gitar'], [0, 'staff_gitar'], [0, 'member_gitar'], [0, 'user_tempo'], [0, 'user_chord'], [0, 'user_pemula'],
            [1, 'ketua_gitar'], [1, 'staff_gitar'], [1, 'member_gitar'], [1, 'user_tempo'], [1, 'user_chord'], [1, 'user_melodi'],
            [2, 'ketua_gitar'], [2, 'wakil_gitar'], [2, 'member_gitar'], [2, 'user_tempo'], [2, 'user_chord'], [2, 'user_maestro'],
            [3, 'ketua_gitar'], [3, 'wakil_gitar'], [3, 'staff_gitar'], [3, 'user_tempo'], [3, 'user_chord'], [3, 'member_trompet'],
            [4, 'ketua_gitar'], [4, 'wakil_gitar'], [4, 'member_gitar'], [4, 'staff_gitar'], [4, 'user_chord'], [4, 'member_biola'],
            [5, 'ketua_gitar'], [5, 'wakil_gitar'], [5, 'staff_gitar'], [5, 'member_gitar'], [5, 'user_tempo'], [5, 'user_ritme'],
        ],
        'Drum Warrior Indonesia' => [
            [0, 'member_drum'], [0, 'user_ritme'], [0, 'user_chord'],
            [1, 'ketua_drum'], [1, 'user_ritme'], [1, 'user_tempo'],
            [2, 'ketua_drum'], [2, 'member_drum'],
        ],
        'Violin Harmony' => [
            [0, 'member_biola'], [0, 'member_gitar'],
            [1, 'ketua_biola'], [1, 'wakil_gitar'],
        ],
        'Brass Academy' => [
            [0, 'member_trompet'], [0, 'ketua_drum'],
            [1, 'ketua_gitar'], [1, 'ketua_biola'],
        ],
    ];

    public function run(): void
    {
        $allPosts = [];

        foreach ($this->postPlan as $communityName => $posts) {
            $community = Community::where('community_name', $communityName)->firstOrFail();
            $allPosts[$communityName] = [];

            foreach ($posts as $post) {
                [$username, $title, $content, $status] = $post;
                $user = User::where('username', $username)->firstOrFail();

                $allPosts[$communityName][] = ForumPost::updateOrCreate(
                    ['community_id' => $community->communities_id, 'user_id' => $user->users_id, 'title' => $title],
                    [
                        'content' => $content,
                        'total_like' => 0,
                        'total_comment' => 0,
                        'status' => $status,
                    ]
                );
            }
        }

        foreach ($this->commentPlan as $communityName => $comments) {
            $createdComments = [];

            foreach ($comments as $i => $commentRow) {
                [$postIndex, $username, $text, $parentIndex] = $commentRow;
                $post = $allPosts[$communityName][$postIndex];
                $user = User::where('username', $username)->firstOrFail();

                $createdComments[$i] = ForumComment::updateOrCreate(
                    ['post_id' => $post->forum_posts_id, 'user_id' => $user->users_id, 'comment' => $text],
                    [
                        'parent_id' => $parentIndex !== null ? $createdComments[$parentIndex]->forum_comments_id : null,
                        'status' => 'Active',
                    ]
                );
            }
        }

        foreach ($this->likePlan as $communityName => $likes) {
            foreach ($likes as [$postIndex, $username]) {
                $post = $allPosts[$communityName][$postIndex];
                $user = User::where('username', $username)->firstOrFail();

                ForumLike::firstOrCreate([
                    'post_id' => $post->forum_posts_id,
                    'user_id' => $user->users_id,
                ]);
            }
        }

        // Sinkronkan total_like & total_comment dengan data sebenarnya.
        foreach ($allPosts as $posts) {
            foreach ($posts as $post) {
                $post->update([
                    'total_like' => $post->likes()->count(),
                    'total_comment' => $post->comments()->where('status', '!=', 'Deleted')->count(),
                ]);
            }
        }
    }
}
