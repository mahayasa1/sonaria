<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Services\GamificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuizAttemptController extends Controller
{
    public function __construct(protected GamificationService $gamification)
    {
    }

    /**
     * Mulai attempt baru untuk sebuah quiz.
     */
    public function start(Request $request, Quiz $quiz): JsonResponse
    {
        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->quizzes_id,
            'user_id' => $request->user()->users_id,
            'started_at' => now(),
        ]);

        return response()->json($attempt, 201);
    }

    /**
     * Submit semua jawaban sekaligus, hitung skor, dan cairkan reward jika lulus.
     * Payload: { "answers": [{ "question_id": 1, "option_id": 3 }, ...] }
     */
    public function submit(Request $request, QuizAttempt $attempt): JsonResponse
    {
        $data = $request->validate([
            'answers' => ['required', 'array', 'min:1'],
            'answers.*.question_id' => ['required', 'exists:quiz_questions,quiz_questions_id'],
            'answers.*.option_id' => ['nullable', 'exists:quiz_options,quiz_options_id'],
        ]);

        $quiz = $attempt->quiz()->with('questions.options')->first();

        $totalCorrect = 0;
        $totalWrong = 0;
        $totalScore = 0;

        foreach ($data['answers'] as $answer) {
            $question = $quiz->questions->firstWhere('quiz_questions_id', $answer['question_id']);
            $correctOption = $question?->options->firstWhere('is_correct', true);
            $isCorrect = $correctOption && $correctOption->quiz_options_id == ($answer['option_id'] ?? null);

            if ($isCorrect) {
                $totalCorrect++;
                $totalScore += (int) $question->score;
            } else {
                $totalWrong++;
            }

            $attempt->answers()->create([
                'question_id' => $answer['question_id'],
                'option_id' => $answer['option_id'] ?? null,
                'is_correct' => $isCorrect,
                'score' => $isCorrect ? $question->score : 0,
                'answered_at' => now(),
            ]);
        }

        $maxScore = (int) $quiz->questions->sum('score');
        $scorePercentage = $maxScore > 0 ? round(($totalScore / $maxScore) * 100, 2) : 0;
        $isPassed = $scorePercentage >= (float) $quiz->passing_score;

        $attempt->update([
            'score' => $scorePercentage,
            'total_correct' => $totalCorrect,
            'total_wrong' => $totalWrong,
            'is_passed' => $isPassed,
            'finished_at' => now(),
        ]);

        if ($isPassed) {
            $user = $attempt->user;
            $categoryId = $quiz->material?->instrument?->category_id;

            $this->gamification->addXp($user, (int) $quiz->xp_reward, $categoryId, "Quiz: {$quiz->title}");
            $this->gamification->addPoint($user, (int) $quiz->point_reward, 'Quiz Passed', Quiz::class, $quiz->quizzes_id, categoryId: $categoryId);
            $this->gamification->unlockAchievement($user, 'first_quiz_passed');
        }

        return response()->json($attempt->fresh('answers'));
    }
}
