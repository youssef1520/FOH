<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;

class TaskUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Task $task) {}

    public function broadcastOn(): Channel
    {
        return new Channel('tasks');
    }

    public function broadcastAs(): string
    {
        return 'task.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'id'          => $this->task->id,
            'title'       => $this->task->title,
            'status'      => $this->task->status,
            'assigned_to' => $this->task->assigned_user_id,
            'project_id'  => $this->task->project_id,
            'updated_at'  => $this->task->updated_at->toISOString(),
        ];
    }
}