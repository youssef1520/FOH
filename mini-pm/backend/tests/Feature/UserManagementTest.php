<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function adminHeaders(): array
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $token = $admin->createToken('test')->plainTextToken;
        return ['Authorization' => "Bearer {$token}"];
    }

    protected function memberHeaders(): array
    {
        $member = User::factory()->create(['role' => User::ROLE_MEMBER]);
        $token = $member->createToken('test')->plainTextToken;
        return ['Authorization' => "Bearer {$token}"];
    }

    /** @test */
public function admin_can_list_users()
{
    // create 3 more users, plus the admin from adminHeaders()
    User::factory()->count(3)->create();
    $response = $this->getJson('/api/users', $this->adminHeaders());
    $response->assertOk()->assertJsonCount(4);
}

    /** @test */
    public function member_cannot_list_users()
    {
        $response = $this->getJson('/api/users', $this->memberHeaders());
        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_create_user()
    {
        $payload = [
            'name'     => 'New User',
            'email'    => 'new@example.com',
            'password' => 'secret',
            'role'     => User::ROLE_MEMBER,
        ];
        $response = $this->postJson('/api/users', $payload, $this->adminHeaders());
        $response->assertStatus(201)->assertJsonFragment(['email' => 'new@example.com']);
        $this->assertDatabaseHas('users', ['email' => 'new@example.com']);
    }

    /** @test */
    public function member_cannot_create_user()
    {
        $response = $this->postJson('/api/users', [
            'name'     => 'X',
            'email'    => 'x@example.com',
            'password' => 'secret',
            'role'     => User::ROLE_MEMBER,
        ], $this->memberHeaders());
        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_update_user()
    {
        $user = User::factory()->create();
        $response = $this->putJson("/api/users/{$user->id}", [
            'name' => 'Updated',
        ], $this->adminHeaders());
        $response->assertOk()->assertJsonFragment(['name' => 'Updated']);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Updated']);
    }

    /** @test */
    public function admin_can_delete_user()
    {
        $user = User::factory()->create();
        $response = $this->deleteJson("/api/users/{$user->id}", [], $this->adminHeaders());
        $response->assertNoContent();
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}