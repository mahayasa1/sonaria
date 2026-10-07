<?php

use App\Models\Notification;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Auth\Notifications\VerifyEmail;
use Database\Seeders\LevelSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Notification as NotificationFacade;

test('unverified users are redirected to the verification notice', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('verification.notice'));
});

test('unverified users cannot use the api', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->getJson('/api/notifications')
        ->assertStatus(409);
});

test('verified users can reach the dashboard gate', function () {
    $user = User::factory()->create(['instrument_id' => null]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('onboarding.category'));
});

test('registering sends a verification email and a welcome notification', function () {
    $this->seed([RoleSeeder::class, LevelSeeder::class]);
    NotificationFacade::fake();

    $this->post('/register', [
        'username' => 'newuser',
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = User::where('email', 'newuser@example.com')->firstOrFail();

    NotificationFacade::assertSentTo($user, VerifyEmail::class);
    expect(Notification::where('user_id', $user->users_id)->where('type', 'System')->count())->toBe(1);
});

test('verifying the email creates an in-app notification', function () {
    $user = User::factory()->unverified()->create();

    event(new Verified($user));

    expect(Notification::where('user_id', $user->users_id)->where('title', 'Email berhasil diverifikasi')->exists())->toBeTrue();
});

test('changing the email resets verification and sends a new link', function () {
    NotificationFacade::fake();

    $user = User::factory()->create(['email' => 'old@example.com']);

    $this->actingAs($user)->patch(route('profile.update'), [
        'name' => $user->name,
        'email' => 'new@example.com',
    ]);

    $user->refresh();

    expect($user->email)->toBe('new@example.com')
        ->and($user->email_verified_at)->toBeNull();
    NotificationFacade::assertSentTo($user, VerifyEmail::class);
});
