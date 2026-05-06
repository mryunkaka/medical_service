<?php

use App\Http\Controllers\Auth\AuthSessionController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')
    ->prefix('auth')
    ->group(function () {
        Route::post('/login', [AuthSessionController::class, 'login']);
        Route::post('/logout', [AuthSessionController::class, 'logout'])->middleware('legacy.auth');
        Route::get('/me', [AuthSessionController::class, 'me'])->middleware('legacy.auth');
        Route::get('/session', [AuthSessionController::class, 'session'])->middleware('legacy.auth');
        Route::get('/status', [AuthSessionController::class, 'status']);
    });
