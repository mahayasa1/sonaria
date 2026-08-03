<?php

use App\Models\Instrument;
use App\Models\MusicCategory;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('users who have not finished onboarding are redirected to choose an instrument', function () {
    $user = User::factory()->create(['instrument_id' => null]);
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('onboarding.category'));
});

test('authenticated users who finished onboarding can visit the dashboard', function () {
    $category = MusicCategory::create(['name' => 'String']);
    $instrument = Instrument::create([
        'category_id' => $category->music_categories_id,
        'name' => 'Gitar',
        'difficulty' => 'Beginner',
    ]);
    $user = User::factory()->create(['instrument_id' => $instrument->intruments_id]);
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});