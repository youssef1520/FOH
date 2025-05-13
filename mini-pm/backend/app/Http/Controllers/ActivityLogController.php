<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;

class ActivityLogController extends Controller
{
    // GET /api/activity-log
    public function index()
    {
        return ActivityLog::with('user:id,name')
                          ->orderBy('created_at','desc')
                          ->get();
    }
}