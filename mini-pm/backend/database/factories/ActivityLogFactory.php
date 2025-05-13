<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityLogFactory extends Factory
{
    protected $model = ActivityLog::class;

    public function definition()
    {
        return [
            'user_id'   => User::factory(),
            'action'    => $this->faker->word(),
            'metadata'  => null,
            'created_at'=> $this->faker->dateTime(),
        ];
    }
}