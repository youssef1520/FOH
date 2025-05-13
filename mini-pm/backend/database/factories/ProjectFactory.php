<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition()
    {
        return [
            'name'        => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'start_date'  => $this->faker->date(),
            'end_date'    => $this->faker->date(),
            'status'      => $this->faker->randomElement(['Planned', 'In Progress', 'Completed']),
        ];
    }
}