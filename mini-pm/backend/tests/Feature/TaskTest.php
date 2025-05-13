<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    /*
       Helpers
     */

    protected function adminHeaders(): array
    {
        $u = User::factory()->create(['role' => User::ROLE_ADMIN]);

        return ['Authorization' => "Bearer {$u->createToken('t')->plainTextToken}"];
    }

    protected function memberHeaders(): array
    {
        $u = User::factory()->create(['role' => User::ROLE_MEMBER]);

        return ['Authorization' => "Bearer {$u->createToken('t')->plainTextToken}"];
    }

    /* 
      Tests
     */

    /** @test */
    public function admin_can_create_task()
    {
        $proj    = Project::factory()->create();
        $payload = Task::factory()->make(['project_id' => $proj->id])->toArray();

        $res = $this->postJson('/api/tasks', $payload, $this->adminHeaders());

        $res->assertStatus(201)
            ->assertJsonFragment(['title' => $payload['title']]);
    }

    /** @test */
    public function member_cannot_create_task()
    {
        $proj    = Project::factory()->create();
        $payload = Task::factory()->make(['project_id' => $proj->id])->toArray();

        $res = $this->postJson('/api/tasks', $payload, $this->memberHeaders());

        $res->assertStatus(403);
    }

    /** @test */
    public function admin_can_delete_task()
    {
        $task = Task::factory()->create();

        $res = $this->deleteJson("/api/tasks/{$task->id}", [], $this->adminHeaders());

        $res->assertNoContent();
    }
}