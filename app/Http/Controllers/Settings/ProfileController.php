<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
{
    $user = $request->user();
    $user->loadMissing('profile');
 
    return Inertia::render('settings/profile', [
        'status' => $request->session()->get('status'),
        'success' => $request->session()->get('success'),
        'profile' => $user->profile,
    ]);
}
 

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->safe();

        $user->fill($validated->only(['name', 'email']));

        if ($request->hasFile('photo')) {
            // Hapus foto lama supaya storage tidak numpuk file yatim.
            if ($user->photo) {
                Storage::disk('public')->delete($user->photo);
            }

            $user->photo = $request->file('photo')->store('avatars', 'public');
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        $user->profile()->updateOrCreate(
            ['user_id' => $user->users_id],
            $validated->only([
                'gender',
                'birth_date',
                'phone',
                'address',
                'province',
                'city',
            ])
        );
        $user->profile()->update([
            'profile_completed' => $this->isProfileComplete($user->fresh('profile')),
        ]);

        return to_route('profile.edit')->with('success', __('Profile updated.'));
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Determine whether every profile field the game "quest" completion
     * bar cares about has been filled in.
     */
    protected function isProfileComplete(User $user): bool
    {
        $profile = $user->profile;

        return (bool) $profile
            && filled($user->name)
            && filled($user->email)
            && filled($profile->gender)
            && filled($profile->birth_date)
            && filled($profile->phone)
            && filled($profile->address)
            && filled($profile->province)
            && filled($profile->city);
    }
}