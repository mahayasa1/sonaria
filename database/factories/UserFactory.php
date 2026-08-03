<?php

namespace Database\Factories;

use App\Models\Level;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    protected static ?string $password;

    public function definition(): array
    {
        $memberRole = Role::where('role_name', 'Member')->first();
        $firstLevel = Level::orderBy('min_xp')->first();

        return [
            'role_id' => $memberRole?->role_id ?? Role::factory(),
            'level_id' => $firstLevel?->level_id ?? Level::factory(),
            'instrument_id' => null,
            'username' => fake()->unique()->userName(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'bio' => fake()->optional()->sentence(),
            'total_xp' => 0,
            'total_point' => 0,
            'status' => 'Active',
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * State: admin (role_name = Admin).
     */
    public function admin(): static
    {
        return $this->state(function () {
            $adminRole = Role::where('role_name', 'Admin')->first();

            return ['role_id' => $adminRole?->role_id];
        });
    }

    /**
     * State: user sudah level 7 (bisa membuat komunitas).
     */
    public function level7(): static
    {
        return $this->state(function () {
            $level7 = Level::where('level', 7)->first();

            return [
                'level_id' => $level7?->level_id,
                'total_xp' => $level7?->min_xp ?? 8000,
            ];
        });
    }

    public function withTwoFactor(?string $secret = null, ?array $recoveryCodes = null): static
    {
        return $this->state(fn () => [
            'two_factor_secret' => encrypt($secret ?? 'test-secret-key'),
            'two_factor_recovery_codes' => encrypt(json_encode(
                $recoveryCodes ?? Collection::times(8, fn () => Str::random(10))->all()
            )),
            'two_factor_confirmed_at' => now(),
        ]);
    }
}
