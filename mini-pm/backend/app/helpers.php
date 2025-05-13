<?php

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

function log_activity(User $user, string $action, Model $subject): void
{
    ActivityLog::create([
        'user_id'      => $user->id,
        'action'       => $action,
        'subject_type' => get_class($subject),
        'subject_id'   => $subject->id,
    ]);
}