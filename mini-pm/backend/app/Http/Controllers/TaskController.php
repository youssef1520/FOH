<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use App\Events\TaskUpdated; 

class TaskController extends Controller
{
    // GET /api/tasks
    public function index()
    {
        $user = Auth::user();
        return $user->role==='admin'
            ? Task::all()
            : Task::where('assigned_user_id',$user->id)->get();
    }

    // POST /api/tasks (admin only)
    public function store(Request $req)
    {
        $data = $req->validate([
            'title'            => 'required|string',
            'description'      => 'nullable|string',
            'assigned_user_id' => 'required|exists:users,id',
            'project_id'       => 'required|exists:projects,id',
            'due_date'         => 'nullable|date',
            'status'           => 'required|in:To Do,In Progress,Done'
        ]);
        $task = Task::create($data);

        ActivityLog::create([
            'action'   => "Assigned task \"{$task->title}\"",
            'user_id'  => Auth::id(),
            'metadata' => ['task_id'=>$task->id]
        ]);

        return response()->json($task, 201);
    }

    // GET /api/tasks/{task}
    public function show(Task $task)
    {
        return $task;
    }

    // PUT /api/tasks/{task}
    public function update(Request $req, Task $task)
    {
        $user = Auth::user();
        if ($user->role==='admin') {
            $data = $req->validate([
                'title'            => 'sometimes|required|string',
                'description'      => 'nullable|string',
                'assigned_user_id' => 'sometimes|required|exists:users,id',
                'project_id'       => 'sometimes|required|exists:projects,id',
                'due_date'         => 'nullable|date',
                'status'           => 'sometimes|required|in:To Do,In Progress,Done'
            ]);
        } else {
            $data = $req->validate([
                'status' => 'required|in:To Do,In Progress,Done'
            ]);
        }
        $task->update($data);

        ActivityLog::create([
            'action'   => "Updated task \"{$task->title}\"",
            'user_id'  => Auth::id(),
            'metadata' => ['task_id'=>$task->id]
        ]);

        TaskUpdated::dispatch($task->fresh());

        return $task;
    }

    // DELETE /api/tasks/{task} (admin only)
    public function destroy(Task $task)
    {
        $title = $task->title;
        $task->delete();

        ActivityLog::create([
            'action'   => "Deleted task \"{$title}\"",
            'user_id'  => Auth::id(),
            'metadata' => ['task_id'=>$task->id]
        ]);

        return response()->noContent();
    }
}