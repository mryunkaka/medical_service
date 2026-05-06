<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'medical_service backend',
        'status' => 'ready',
        'docs' => 'Gunakan /api/auth, /api/lookups, /api/medical-records, dan /api/realtime.',
    ]);
});
