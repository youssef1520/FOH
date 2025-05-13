<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;

class TasksTableSeeder extends Seeder
{
    public function run(): void
    {
        $projects = Project::all();
        $members  = User::where('role', User::ROLE_MEMBER)->get();
        $statuses = ['To Do', 'In Progress', 'Done'];
        $today    = Carbon::today();

        foreach ($projects as $project) {
            foreach (range(1, 3) as $i) {
                $member = $members->random();

                Task::create([
                    'title'             => "Task {$i} of {$project->name}",
                    'description'       => "Auto-seeded task assigned to {$member->name}",
                    'assigned_user_id'  => $member->id,
                    'project_id'        => $project->id,
                    'status'            => $statuses[array_rand($statuses)],
                    'due_date'          => $today->copy()->addDays(rand(1, 10)),
                ]);
            }
        }
    }
}