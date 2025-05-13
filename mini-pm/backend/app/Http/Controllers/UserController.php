<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // GET /api/users
    public function index()
    {
        return User::all();
    }

    // POST /api/users
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => ['required', Rule::in(['admin','member'])]
        ]);

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        ActivityLog::create([
            'action'       => "Created user \"{$user->name}\"",
            'user_id'      => Auth::id(),
            'subject_type' => User::class,
            'subject_id'   => $user->id,
            'metadata'     => ['user_id' => $user->id]
        ]);

        return response()->json($user, 201);
    }

    // GET /api/users/{user}
    public function show(User $user)
    {
        return $user;
    }

    // PUT /api/users/{user}
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name'     => 'sometimes|required|string',
            'email'    => ['sometimes','required','email', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|required|string|min:6',
            'role'     => ['sometimes','required', Rule::in(['admin','member'])]
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        ActivityLog::create([
            'action'       => "Updated user \"{$user->name}\"",
            'user_id'      => Auth::id(),
            'subject_type' => User::class,
            'subject_id'   => $user->id,
            'metadata'     => ['user_id' => $user->id]
        ]);

        return response()->json($user);
    }

    // DELETE /api/users/{user}
    public function destroy(User $user)
    {
        $name = $user->name;
        $user->delete();

        ActivityLog::create([
            'action'       => "Deleted user \"{$name}\"",
            'user_id'      => Auth::id(),
            'subject_type' => User::class,
            'subject_id'   => $user->id,
            'metadata'     => ['user_id' => $user->id]
        ]);

        return response()->noContent();
    }
}