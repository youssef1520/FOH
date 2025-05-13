<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use Illuminate\Support\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    /*
     
     Helpers
     
    */

    protected function adminHeaders(): array
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        return ['Authorization' => "Bearer {$admin->createToken('t')->plainTextToken}"];
    }

    protected function memberHeaders(): array
    {
        $member = User::factory()->create(['role' => User::ROLE_MEMBER]);

        return ['Authorization' => "Bearer {$member->createToken('t')->plainTextToken}"];
    }

    /** Generate a coherent start/end pair */
    protected function validDates(): array
    {
        $start = Carbon::today();
        $end   = $start->copy()->addDays(7);

        return [$start->toDateString(), $end->toDateString()];
    }

    /* 
       Tests
     */

    /** @test */
    public function admin_can_create_project()
    {
        [$start, $end] = $this->validDates();

        $payload = Project::factory()->make([
            'start_date' => $start,
            'end_date'   => $end,
        ])->toArray();

        $res = $this->postJson('/api/projects', $payload, $this->adminHeaders());

        $res->assertStatus(201)
            ->assertJsonFragment(['name' => $payload['name']]);
    }

    /** @test */
    public function member_cannot_create_project()
    {
        [$start, $end] = $this->validDates();

        $payload = Project::factory()->make([
            'start_date' => $start,
            'end_date'   => $end,
        ])->toArray();

        $res = $this->postJson('/api/projects', $payload, $this->memberHeaders());

        $res->assertStatus(403);
    }

    /** @test */
    public function admin_can_update_project()
    {
        // create a project with valid dates first
        [$start, $end] = $this->validDates();

        $project = Project::factory()->create([
            'start_date' => $start,
            'end_date'   => $end,
        ]);

        // payload: change only 'name'
        $payload = array_merge(
            $project->only(['start_date', 'end_date', 'status']),
            ['name' => 'X']
        );

        $res = $this->putJson(
            "/api/projects/{$project->id}",
            $payload,
            $this->adminHeaders()
        );

        $res->assertOk()
            ->assertJsonFragment(['name' => 'X']);
    }

    /** @test */
    public function admin_can_delete_project()
    {
        [$start, $end] = $this->validDates();

        $project = Project::factory()->create([
            'start_date' => $start,
            'end_date'   => $end,
        ]);

        $res = $this->deleteJson("/api/projects/{$project->id}", [], $this->adminHeaders());

        $res->assertNoContent();
    }
}