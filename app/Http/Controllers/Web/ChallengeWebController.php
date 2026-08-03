<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Concerns\ResolvesActiveCommunity;
use App\Http\Controllers\Controller;
use App\Models\ChallengeSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChallengeWebController extends Controller
{
    use ResolvesActiveCommunity;

    /**
     * Mirror App\Http\Controllers\Api\ChallengeController::index, ditambah
     * status submission milik user yang sedang login.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $membership = $this->activeMembership($user);

        if (! $membership) {
            return redirect()->route('communities.index')
                ->with('error', 'Gabung ke sebuah komunitas dulu untuk melihat Challenge.');
        }

        $community = $membership->community;

        $challenge = $community->challenges()
            ->where('status', 'Active')
            ->with('instrument')
            ->first();

        $mySubmission = $challenge
            ? ChallengeSubmission::where('challenge_id', $challenge->challenges_id)
                ->where('user_id', $user->users_id)
                ->latest()
                ->first()
            : null;

        return Inertia::render('Challenge/Index', [
            'community' => $community,
            'challenge' => $challenge,
            'mySubmission' => $mySubmission,
        ]);
    }
}
