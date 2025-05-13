<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;

class ProjectsTableSeeder extends Seeder
{
    public function run(): void
    {
        // pick the first three admins from the UsersTableSeeder
        $admins = User::where('role', User::ROLE_ADMIN)->take(3)->get();

        $now = Carbon::today();

        foreach ($admins as $idx => $admin) {
            Project::create([
                'name'        => "Project #".($idx + 1),
                'description' => "Demo project owned by {$admin->name}",
                'start_date'  => $now->copy()->subDays(7),
                'end_date'    => $now->copy()->addDays(14),
                'status'      => ['Planned', 'In Progress', 'Completed'][$idx % 3],
            ]);
        }
    }
}