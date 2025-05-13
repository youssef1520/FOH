<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    // GET /api/projects
    public function index()
    {
        $user = Auth::user();
        if ($user->role === 'member') {
            return Project::whereHas('tasks', function ($q) use ($user) {
                $q->where('assigned_user_id', $user->id);
            })->get();
        }
        return Project::all();
    }

    // POST /api/projects (admin only)
    public function store(Request $req)
    {
        $data = $req->validate([
            'name'        => 'required|string',
            'description' => 'nullable|string',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'status'      => 'required|in:Planned,In Progress,Completed'
        ]);
        
        $proj = Project::create($data);

        ActivityLog::create([
            'action'   => "Created project \"{$proj->name}\"",
            'user_id'  => Auth::id(),
            'metadata' => ['project_id'=>$proj->id]
        ]);

        return response()->json($proj, 201);
    }

   // GET /api/projects/{project}
    public function show(Project $project)
    {
        $user = Auth::user();
        if ($user->role === 'member' && ! $project->tasks()->where('assigned_user_id', $user->id)->exists()) {
            abort(403, 'Unauthorized');
        }
        return $project;
    }

    // PUT /api/projects/{project} (admin only)
    public function update(Request $req, Project $project)
    {
        $data = $req->validate([
            'name'        => 'required|string',
            'description' => 'nullable|string',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'status'      => 'required|in:Planned,In Progress,Completed'
        ]);
        
        $project->update($data);

        ActivityLog::create([
            'action'   => "Updated project \"{$project->name}\"",
            'user_id'  => Auth::id(),
            'metadata' => ['project_id'=>$project->id]
        ]);

        return $project;
    }

    // DELETE /api/projects/{project} (admin only)
    public function destroy(Project $project)
    {
        $project->delete();

        ActivityLog::create([
            'action'   => "Deleted project \"{$project->name}\"",
            'user_id'  => Auth::id(),
            'metadata' => ['project_id'=>$project->id]
        ]);

        return response()->noContent();
    }
}