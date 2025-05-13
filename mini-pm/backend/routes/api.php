<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ActivityLogController;

// Public
Route::post('login', [AuthController::class, 'login']);

// Protected
Route::middleware('auth:sanctum')->group(function () {
    // Logout
    Route::post('logout', [AuthController::class, 'logout']);

    // User management (Admin only)
    Route::middleware(\App\Http\Middleware\RoleMiddleware::class . ':admin')->group(function () {
        Route::get('users',           [UserController::class, 'index']);
        Route::post('users',          [UserController::class, 'store']);
        Route::get('users/{user}',    [UserController::class, 'show']);
        Route::put('users/{user}',    [UserController::class, 'update']);
        Route::delete('users/{user}', [UserController::class, 'destroy']);
    });

    // Projects
    Route::get('projects',           [ProjectController::class, 'index']);
    Route::post('projects',          [ProjectController::class, 'store'])
        ->middleware(\App\Http\Middleware\RoleMiddleware::class . ':admin');
    Route::get('projects/{project}', [ProjectController::class, 'show']);
    Route::put('projects/{project}', [ProjectController::class, 'update'])
        ->middleware(\App\Http\Middleware\RoleMiddleware::class . ':admin');
    Route::delete('projects/{project}', [ProjectController::class, 'destroy'])
        ->middleware(\App\Http\Middleware\RoleMiddleware::class . ':admin');

    // Tasks
    Route::get('tasks',             [TaskController::class, 'index']);
    Route::post('tasks',            [TaskController::class, 'store'])
        ->middleware(\App\Http\Middleware\RoleMiddleware::class . ':admin');
    Route::get('tasks/{task}',      [TaskController::class, 'show']);
    Route::put('tasks/{task}',      [TaskController::class, 'update']);
    Route::delete('tasks/{task}',   [TaskController::class, 'destroy'])
        ->middleware(\App\Http\Middleware\RoleMiddleware::class . ':admin');

    // Activity log
    Route::get('activity-log',      [ActivityLogController::class, 'index']);
});