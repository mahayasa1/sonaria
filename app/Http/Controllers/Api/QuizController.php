<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use Illuminate\Http\JsonResponse;

class QuizController extends Controller
{
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
