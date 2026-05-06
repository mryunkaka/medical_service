<?php

use App\Http\Controllers\Realtime\RealtimeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'legacy.auth'])
    ->prefix('realtime')
    ->group(function () {
        Route::get('/stream', [RealtimeController::class, 'stream']);
        Route::get('/delta', [RealtimeController::class, 'delta']);
    });
