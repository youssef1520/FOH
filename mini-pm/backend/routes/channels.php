<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('tasks', fn ($user) => true);