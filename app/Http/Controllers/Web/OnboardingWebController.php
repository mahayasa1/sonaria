<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\MusicCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Onboarding: dijalankan sekali setelah login pertama kali, sebelum user
 * bisa mencari komunitas (lihat routes/web.php & CLAUDE.md alur no. 3).
 */
class OnboardingWebController extends Controller
{
    public function category(Request $request): Response
    {
        return Inertia::render('Onboarding/Category', [
            'categories' => MusicCategory::with(['instruments' => fn ($q) => $q->orderBy('name')])
                ->orderBy('name')
                ->get(),
            'currentInstrumentId' => $request->user()->instrument_id,
        ]);
    }

    public function storeInstrument(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'instrument_id' => ['required', 'exists:instruments,intruments_id'],
        ]);

        $user = $request->user();
        $user->instrument_id = $data['instrument_id'];
        $user->save();

        return redirect()->route('communities.index');
    }
}
