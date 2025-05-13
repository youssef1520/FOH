<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function login_with_valid_credentials_returns_token_and_role()
    {
        $user = User::factory()->create([
            'email'    => 'admin@example.com',
            'password' => bcrypt('secret'),
            'role'     => User::ROLE_ADMIN,
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'admin@example.com',
            'password' => 'secret',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure(['token','role'])
            ->assertJson(['role' => 'admin']);
    }

    /** @test */
    public function login_with_invalid_credentials_fails()
    {
        $this->postJson('/api/login', [
            'email'    => 'noone@example.com',
            'password' => 'wrong',
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors('email');
    }

    
}