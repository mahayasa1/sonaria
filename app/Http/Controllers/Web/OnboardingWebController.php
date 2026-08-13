<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\User;
use App\Models\Instrument;
use App\Models\MusicCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;


class OnboardingWebController extends Controller
{
    /**
     * Halaman pilih/ganti kategori & instrument.
     * Dipakai untuk onboarding pertama kali MAUPUN saat user
     * ingin mengganti instrument yang sudah pernah dipilih.
     */
    public function category(): Response
    {
        $categories = MusicCategory::with('instruments')->get();

        return Inertia::render('Onboarding/Category', [
            'categories' => $categories,
            'currentInstrumentId' => Auth::user()->instrument_id,
        ]);
    }

    /**
     * Simpan / perbarui instrument pilihan user, lalu arahkan
     * langsung ke komunitas yang sesuai kategori instrument itu.
     */
    public function storeInstrument(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'instrument_id' => ['required', 'integer', 'exists:instruments,intruments_id'],
        ]);

        $instrument = Instrument::findOrFail($validated['instrument_id']);

        // update(), bukan create-once — supaya method ini juga jadi
        // endpoint "ganti instrument", bukan cuma dipakai sekali saja.
        
        /** @var User $user */
        $user = Auth::user();

        $user->update([
            'instrument_id' => $instrument->intruments_id,
        ]);

        $matchingCommunities = Community::where('music_categories_id', $instrument->music_categories_id)
            ->where('is_active', true)
            ->get();

        // Cuma ada satu komunitas yang cocok -> langsung antar ke sana.
        if ($matchingCommunities->count() === 1) {
            return redirect()
                ->route('communities.show', $matchingCommunities->first())
                ->with('success', 'Instrument berhasil disimpan. Ini komunitas yang cocok untukmu!');
        }

        // Lebih dari satu (atau belum ada sama sekali) -> arahkan ke
        // daftar komunitas yang sudah difilter sesuai kategori instrument.
        return redirect()
            ->route('communities.index', ['category_id' => $instrument->music_categories_id])
            ->with('success', 'Instrument berhasil disimpan. Berikut komunitas yang sesuai untukmu.');
    }
}