<?php

use App\Models\Instrument;
use App\Models\MusicCategory;
use App\Models\User;

test('registering a new user redirects to onboarding, not straight to the dashboard', function () {
    $response = $this->post('/register', [
        'username' => 'testuser',
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('onboarding.category'));
});

test('a user without an instrument is redirected away from the community list', function () {
    $user = User::factory()->create(['instrument_id' => null]);

    $response = $this->actingAs($user)->get(route('communities.index'));

    $response->assertRedirect(route('onboarding.category'));
});

test('choosing an instrument sends the user to the community list', function () {
    $category = MusicCategory::create(['name' => 'String']);
    $instrument = Instrument::create([
        'category_id' => $category->music_categories_id,
        'name' => 'Gitar',
        'difficulty' => 'Beginner',
    ]);
    $user = User::factory()->create(['instrument_id' => null]);

    $response = $this->actingAs($user)->post('/onboarding/instrument', [
        'instrument_id' => $instrument->intruments_id,
    ]);

    $response->assertRedirect(route('communities.index'));
    expect($user->fresh()->instrument_id)->toBe($instrument->intruments_id);
});
