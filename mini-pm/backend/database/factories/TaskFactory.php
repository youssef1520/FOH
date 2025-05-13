<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition()
    {
        return [
            'title'             => $this->faker->sentence(),
            'description'       => $this->faker->paragraph(),
            'project_id'        => Project::factory(),
            'assigned_user_id'  => User::factory()->state(['role' => User::ROLE_MEMBER]),
            'status'            => $this->faker->randomElement(['To Do','In Progress','Done']),
            'due_date'          => $this->faker->date(),
        ];
    }
}