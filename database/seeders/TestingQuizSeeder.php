<?php

namespace Database\Seeders;

use App\Models\Material;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizAttempt;
use App\Models\QuizOption;
use App\Models\QuizQuestion;
use App\Models\User;
use App\Services\GamificationService;
use Illuminate\Database\Seeder;

/**
 * Membuat 1 quiz (5 pertanyaan, 4 opsi/pertanyaan, tepat 1 jawaban benar)
 * untuk setiap Material yang sudah dibuat TestingMaterialSeeder (24 material
 * -> 24 quiz, sesuai target minimal 20-25 quiz di brief).
 *
 * Quiz attempt (dengan hasil Passed/Failed) hanya dibuat untuk quiz "Level 1
 * Video Pengantar" tiap komunitas supaya data tetap fokus & mudah ditelusuri,
 * sementara quiz lain tersedia sebagai konten yang belum pernah dicoba
 * (menguji state "Not Attempted").
 */
class TestingQuizSeeder extends Seeder
{
    public function __construct(protected GamificationService $gamification)
    {
    }

    protected array $optionLabels = ['A', 'B', 'C', 'D'];

    public function run(): void
    {
        $materials = Material::orderBy('materials_id')->get();

        foreach ($materials as $material) {
            $this->seedQuizForMaterial($material);
        }

        $this->seedAttempts();
    }

    protected function seedQuizForMaterial(Material $material): void
    {
        $quiz = Quiz::updateOrCreate(
            ['material_id' => $material->materials_id, 'title' => "Quiz: {$material->title}"],
            [
                'description' => "Uji pemahamanmu tentang {$material->title}.",
                'total_questions' => 5,
                'duration' => 5,
                'passing_score' => 70,
                'xp_reward' => 30,
                'point_reward' => 5,
                'status' => $material->status === 'Published' ? 'Published' : 'Draft',
            ]
        );

        for ($questionNumber = 1; $questionNumber <= 5; $questionNumber++) {
            $question = QuizQuestion::updateOrCreate(
                ['quiz_id' => $quiz->quizzes_id, 'order_number' => $questionNumber],
                [
                    'question' => "Pertanyaan {$questionNumber} tentang \"{$material->title}\": manakah pernyataan yang paling tepat?",
                    'question_type' => 'Multiple Choice',
                    'score' => 20,
                ]
            );

            // Rotasi posisi jawaban benar (A/B/C/D) supaya tidak selalu di
            // posisi yang sama, tetap deterministic berdasarkan nomor soal.
            $correctIndex = ($questionNumber + $material->materials_id) % 4;

            foreach ($this->optionLabels as $index => $label) {
                QuizOption::updateOrCreate(
                    ['question_id' => $question->quiz_questions_id, 'option_label' => $label],
                    [
                        'option_text' => $index === $correctIndex
                            ? "Jawaban yang benar untuk soal {$questionNumber}"
                            : "Pilihan pengecoh {$label} untuk soal {$questionNumber}",
                        'is_correct' => $index === $correctIndex,
                    ]
                );
            }
        }
    }

    protected function seedAttempts(): void
    {
        // material_slug => list of [username, jumlah_benar_dari_5]
        $attemptPlan = [
            'gitar-level-1-video' => [
                ['username' => 'ketua_gitar', 'correct' => 5],
                ['username' => 'member_gitar', 'correct' => 4],
                ['username' => 'user_tempo', 'correct' => 3],
                ['username' => 'user_chord', 'correct' => 2],
            ],
            'drum-level-1-video' => [
                ['username' => 'ketua_drum', 'correct' => 5],
                ['username' => 'member_drum', 'correct' => 3],
            ],
            'violin-level-1-video' => [
                ['username' => 'ketua_biola', 'correct' => 5],
            ],
            'brass-level-1-video' => [
                ['username' => 'member_trompet', 'correct' => 4],
            ],
        ];

        foreach ($attemptPlan as $slug => $attempts) {
            $material = Material::where('slug', $slug)->firstOrFail();
            $quiz = Quiz::where('material_id', $material->materials_id)
                ->where('title', "Quiz: {$material->title}")
                ->firstOrFail();

            $questions = $quiz->questions()->with('options')->orderBy('order_number')->get();

            foreach ($attempts as $item) {
                $user = User::where('username', $item['username'])->firstOrFail();
                $correctCount = $item['correct'];

                $attempt = QuizAttempt::updateOrCreate(
                    ['quiz_id' => $quiz->quizzes_id, 'user_id' => $user->users_id],
                    [
                        'score' => $correctCount * 20,
                        'total_correct' => $correctCount,
                        'total_wrong' => 5 - $correctCount,
                        'is_passed' => ($correctCount * 20) >= (float) $quiz->passing_score,
                        'started_at' => now()->subDays(4),
                        'finished_at' => now()->subDays(4)->addMinutes(5),
                        'duration' => 300,
                    ]
                );

                if (! $attempt->wasRecentlyCreated) {
                    continue;
                }

                foreach ($questions as $index => $question) {
                    $isCorrect = $index < $correctCount;
                    $option = $isCorrect
                        ? $question->options->firstWhere('is_correct', true)
                        : $question->options->firstWhere('is_correct', false);

                    QuizAnswer::create([
                        'attempt_id' => $attempt->quiz_attempts_id,
                        'question_id' => $question->quiz_questions_id,
                        'option_id' => $option?->quiz_options_id,
                        'is_correct' => $isCorrect,
                        'score' => $isCorrect ? $question->score : 0,
                        'answered_at' => now()->subDays(4),
                    ]);
                }

                if ($attempt->is_passed) {
                    $categoryId = $material->instrument?->category_id;

                    $this->gamification->addXp($user, (int) $quiz->xp_reward, $categoryId, "Quiz: {$quiz->title}");
                    $this->gamification->addPoint($user, (int) $quiz->point_reward, 'Quiz Passed', Quiz::class, $quiz->quizzes_id);
                }
            }
        }
    }
}
