<?php

namespace Database\Factories;

use App\Models\Community;
use App\Models\MusicCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Community>
 */
class CommunityFactory extends Factory
{
    protected $model = Community::class;

    public function definition(): array
    {
        return [
            'owner_id' => User::factory()->level7(),
            'category_id' => MusicCategory::inRandomOrder()->value('music_categories_id') ?? MusicCategory::factory(),
            'community_name' => fake()->unique()->words(3, true) . ' Community',
            'description' => fake()->sentence(),
            'total_member' => 1,
            'status' => 'Active',
        ];
    }
}
