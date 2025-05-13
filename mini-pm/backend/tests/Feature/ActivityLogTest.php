<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ActivityLogTest extends TestCase
{
    use RefreshDatabase;

    protected function headers(): array
    {
        $u = User::factory()->create();
        return ['Authorization'=>"Bearer {$u->createToken('t')->plainTextToken}"];
    }

    /** @test */
    public function authenticated_can_list_activity_logs()
    {
        ActivityLog::factory()->count(5)->create();
        $res = $this->getJson('/api/activity-log', $this->headers());
        $res->assertOk()->assertJsonCount(5);
    }
}