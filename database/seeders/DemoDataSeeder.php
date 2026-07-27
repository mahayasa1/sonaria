<?php

namespace Database\Seeders;

use App\Models\Challenge;
use App\Models\Community;
use App\Models\CommunityMember;
use App\Models\CommunityRole;
use App\Models\DailyMission;
use App\Models\Instrument;
use App\Models\MainQuest;
use App\Models\Material;
use App\Models\Practice;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizOption;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Data contoh supaya alur end-to-end (login -> pilih instrumen -> gabung
 * komunitas -> main quest/daily mission/challenge/forum) bisa langsung
 * dicoba tanpa mengisi data manual dulu.
 *
 * CATATAN: hanya Main Quest level 1 yang diisi konten lengkap (materi, quiz,
 * practice) sebagai contoh. Level 2-7 sengaja dibuat sebagai "shell" (judul
 * saja, status Draft) — isi materinya via panel Ketua/Wakil Ketua atau seeder
 * tambahan sesuai kebutuhan.
 */
class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('role_name', 'Admin')->first();
        $guitar = Instrument::where('name', 'Gitar Akustik')->first();

        // 1. Akun admin platform
        $admin = User::factory()->admin()->create([
            'username' => 'admin_sonaria',
            'name' => 'Admin Sonaria',
            'email' => 'admin@sonaria.test',
            'password' => Hash::make('password'),
        ]);

        // 2. Owner komunitas (level 7, boleh membuat komunitas)
        $owner = User::factory()->level7()->create([
            'username' => 'ketua_gitar',
            'name' => 'Salsa (Ketua)',
            'email' => 'ketua@sonaria.test',
            'password' => Hash::make('password'),
            'instrument_id' => $guitar?->intruments_id,
        ]);

        $community = Community::factory()->create([
            'owner_id' => $owner->users_id,
            'category_id' => $guitar?->category_id,
            'community_name' => 'Komunitas Gitar Nusantara',
            'description' => 'Wadah belajar gitar bareng, dari dasar sampai mahir.',
        ]);

        $ketuaRole = CommunityRole::where('role_name', 'Ketua')->first();
        $wakilRole = CommunityRole::where('role_name', 'Wakil Ketua')->first();
        $staffRole = CommunityRole::where('role_name', 'Staff')->first();
        $memberRole = CommunityRole::where('role_name', 'Member')->first();

        CommunityMember::create([
            'community_id' => $community->communities_id,
            'user_id' => $owner->users_id,
            'role_id' => $ketuaRole->community_roles_id,
            'join_date' => now(),
            'status' => 'Active',
        ]);

        // 3. Wakil Ketua, Staff, dan Member contoh
        $viceLeader = User::factory()->create([
            'username' => 'wakil_gitar',
            'name' => 'Bima (Wakil Ketua)',
            'email' => 'wakilketua@sonaria.test',
            'password' => Hash::make('password'),
            'instrument_id' => $guitar?->intruments_id,
        ]);
        CommunityMember::create([
            'community_id' => $community->communities_id,
            'user_id' => $viceLeader->users_id,
            'role_id' => $wakilRole->community_roles_id,
            'join_date' => now(),
            'status' => 'Active',
        ]);

        $staff = User::factory()->create([
            'username' => 'staff_gitar',
            'name' => 'Ica (Staff)',
            'email' => 'staff@sonaria.test',
            'password' => Hash::make('password'),
            'instrument_id' => $guitar?->intruments_id,
        ]);
        CommunityMember::create([
            'community_id' => $community->communities_id,
            'user_id' => $staff->users_id,
            'role_id' => $staffRole->community_roles_id,
            'join_date' => now(),
            'status' => 'Active',
        ]);

        $member = User::factory()->create([
            'username' => 'aditya_gitar',
            'name' => 'Aditya (Member)',
            'email' => 'member@sonaria.test',
            'password' => Hash::make('password'),
            'instrument_id' => $guitar?->intruments_id,
        ]);
        CommunityMember::create([
            'community_id' => $community->communities_id,
            'user_id' => $member->users_id,
            'role_id' => $memberRole->community_roles_id,
            'join_date' => now(),
            'status' => 'Active',
        ]);

        $community->update(['total_member' => 4]);

        // 4. Main Quest 1-7 (hanya level 1 diisi materi+quiz+practice lengkap)
        $quest1 = MainQuest::create([
            'community_id' => $community->communities_id,
            'created_by' => $owner->users_id,
            'level' => 1,
            'title' => 'Dasar Fingering',
            'description' => 'Kenali posisi jari dasar pada fretboard gitar.',
            'xp_reward' => 100,
            'point_reward' => 20,
            'status' => 'Published',
        ]);

        for ($level = 2; $level <= 7; $level++) {
            MainQuest::create([
                'community_id' => $community->communities_id,
                'created_by' => $owner->users_id,
                'level' => $level,
                'title' => "Main Quest Level {$level}",
                'description' => 'Konten akan dilengkapi oleh pengurus komunitas.',
                'xp_reward' => 100 * $level,
                'point_reward' => 20 * $level,
                'status' => 'Draft',
            ]);
        }

        $material = Material::create([
            'main_quest_id' => $quest1->main_quests_id,
            'instrument_id' => $guitar?->intruments_id,
            'title' => 'Video Dasar Fingering',
            'slug' => 'video-dasar-fingering',
            'description' => 'Tutorial posisi jari dasar untuk pemula.',
            'difficulty' => 'Easy',
            'estimated_time' => 15,
            'order_number' => 1,
            'status' => 'Published',
        ]);

        $quiz = Quiz::create([
            'material_id' => $material->materials_id,
            'title' => 'Quiz Dasar Fingering',
            'description' => 'Uji pemahamanmu tentang posisi jari dasar.',
            'total_questions' => 1,
            'duration' => 5,
            'passing_score' => 70,
            'xp_reward' => 30,
            'point_reward' => 5,
            'status' => 'Published',
        ]);

        $question = QuizQuestion::create([
            'quiz_id' => $quiz->quizzes_id,
            'question' => 'Jari manakah yang biasanya menekan fret pada senar paling tebal untuk chord dasar E mayor?',
            'question_type' => 'Multiple Choice',
            'score' => 100,
            'order_number' => 1,
        ]);

        QuizOption::create(['question_id' => $question->quiz_questions_id, 'option_label' => 'A', 'option_text' => 'Jari telunjuk', 'is_correct' => false]);
        QuizOption::create(['question_id' => $question->quiz_questions_id, 'option_label' => 'B', 'option_text' => 'Jari tengah', 'is_correct' => true]);
        QuizOption::create(['question_id' => $question->quiz_questions_id, 'option_label' => 'C', 'option_text' => 'Jari manis', 'is_correct' => false]);
        QuizOption::create(['question_id' => $question->quiz_questions_id, 'option_label' => 'D', 'option_text' => 'Jari kelingking', 'is_correct' => false]);

        Practice::create([
            'material_id' => $material->materials_id,
            'title' => 'Rekam Latihan Fingering',
            'description' => 'Rekam dirimu memainkan progresi chord dasar selama 30 detik.',
            'minimum_score' => 70,
            'xp_reward' => 70,
            'point_reward' => 15,
            'deadline' => now()->addDays(14),
            'status' => 'Active',
        ]);

        // 5. Daily Mission (6 slot). Memakai quiz yang sama sebagai contoh —
        // pada penggunaan nyata setiap mission idealnya punya quiz sendiri.
        for ($i = 1; $i <= 6; $i++) {
            DailyMission::create([
                'community_id' => $community->communities_id,
                'created_by' => $owner->users_id,
                'quiz_id' => $quiz->quizzes_id,
                'title' => "Kuis Harian {$i}",
                'description' => 'Kuis singkat harian, reward XP kecil dan acak.',
                'mission_number' => $i,
                'xp_reward_min' => 5,
                'xp_reward_max' => 20,
                'start_date' => now()->toDateString(),
                'end_date' => now()->addDays(7)->toDateString(),
                'status' => 'Active',
            ]);
        }

        // 6. Challenge (hanya 1 aktif)
        Challenge::create([
            'community_id' => $community->communities_id,
            'created_by' => $owner->users_id,
            'instrument_id' => $guitar?->intruments_id,
            'title' => 'Cover Lagu Daerah Favoritmu',
            'description' => 'Rekam video cover lagu daerah pilihanmu menggunakan gitar.',
            'xp_reward' => 500,
            'point_reward' => 100,
            'start_date' => now()->toDateString(),
            'end_date' => now()->addDays(30)->toDateString(),
            'status' => 'Active',
        ]);
    }
}
