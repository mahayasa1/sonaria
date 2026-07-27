<?php

namespace Database\Factories;

use App\Models\Level;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Level>
 */
class LevelFactory extends Factory
{
    protected $model = Level::class;

    public function definition(): array
    {
        return [
            'level' => fake()->unique()->numberBetween(1, 100),
            'title' => fake()->word(),
            'min_xp' => 0,
            'max_xp' => 999,
            'color' => fake()->hexColor(),
            'can_create_community' => false,
        ];
    }
}
