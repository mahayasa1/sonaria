<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Quiz;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class QuizController extends Controller
{
    /**
     * Buat quiz baru beserta pertanyaan & opsi jawabannya sekaligus, di bawah
     * sebuah Learning Material. Hanya Ketua/Wakil Ketua komunitas pemilik.
     */
    public function store(Request $request, Material $material): JsonResponse
    {
        $material->loadMissing('mainQuest.community');
        $this->authorize('manage', $material->mainQuest->community);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:255'],
            'duration' => ['nullable', 'integer', 'min:0'],
            'passing_score' => ['nullable', 'integer', 'min:0', 'max:100'],
            'xp_reward' => ['required', 'integer', 'min:0'],
            'point_reward' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'in:Draft,Published'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.question' => ['required', 'string'],
            'questions.*.options' => ['required', 'array', 'min:2'],
            'questions.*.options.*.option_label' => ['required', 'string', 'max:10'],
            'questions.*.options.*.option_text' => ['required', 'string', 'max:255'],
            'questions.*.options.*.is_correct' => ['required', 'boolean'],
        ]);

        foreach ($data['questions'] as $i => $question) {
            $correctCount = collect($question['options'])->where('is_correct', true)->count();
            if ($correctCount !== 1) {
                throw ValidationException::withMessages([
                    "questions.{$i}.options" => ['Setiap pertanyaan harus punya tepat satu jawaban benar.'],
                ]);
            }
        }

        $quiz = DB::transaction(function () use ($data, $material) {
            $quiz = Quiz::create([
                'material_id' => $material->materials_id,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'total_questions' => count($data['questions']),
                'duration' => $data['duration'] ?? null,
                'passing_score' => $data['passing_score'] ?? null,
                'xp_reward' => $data['xp_reward'],
                'point_reward' => $data['point_reward'] ?? 0,
                'status' => $data['status'] ?? 'Draft',
            ]);

            foreach ($data['questions'] as $order => $question) {
                $quizQuestion = $quiz->questions()->create([
                    'question' => $question['question'],
                    'order_number' => $order + 1,
                ]);

                foreach ($question['options'] as $option) {
                    $quizQuestion->options()->create($option);
                }
            }

            return $quiz;
        });

        return response()->json($quiz->load('questions.options'), 201);
    }

    /**
     * Tampilkan quiz + pertanyaan & opsi jawaban TANPA membocorkan is_correct.
     */
    public function show(Quiz $quiz): JsonResponse
    {
        $quiz->load(['questions.options' => function ($query) {
            $query->select('quiz_options_id', 'question_id', 'option_label', 'option_text');
        }]);

        return response()->json($quiz);
    }
}
