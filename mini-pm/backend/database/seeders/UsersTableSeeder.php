<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name'     => 'Alice Admin',
                'email'    => 'alice.admin@example.com',
                'password' => Hash::make('password'),
                'role'     => 'admin',
            ],
            [
                'name'     => 'Aaron Admin',
                'email'    => 'aaron.admin@example.com',
                'password' => Hash::make('password'),
                'role'     => 'admin',
            ],
            [
                'name'     => 'Anna Admin',
                'email'    => 'anna.admin@example.com',
                'password' => Hash::make('password'),
                'role'     => 'admin',
            ],
            [
                'name'     => 'Bob Member',
                'email'    => 'bob.member@example.com',
                'password' => Hash::make('password'),
                'role'     => 'member',
            ],
            [
                'name'     => 'Bella Member',
                'email'    => 'bella.member@example.com',
                'password' => Hash::make('password'),
                'role'     => 'member',
            ],
            [
                'name'     => 'Ben Member',
                'email'    => 'ben.member@example.com',
                'password' => Hash::make('password'),
                'role'     => 'member',
            ],
        ];

        foreach ($users as $data) {
            User::updateOrCreate(
                ['email' => $data['email']],
                $data
            );
        }
    }
}