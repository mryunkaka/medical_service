<?php

use App\Http\Controllers\Api\LookupController;
use App\Http\Controllers\Api\MedicalRecordController;
use App\Http\Controllers\Api\AccountSettingsController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EmsServiceController;
use App\Http\Controllers\Api\PharmacyRecapController;
use App\Http\Controllers\Api\SecretaryController;
use Illuminate\Support\Facades\Route;

require __DIR__.'/auth.php';
require __DIR__.'/realtime.php';

Route::middleware(['web', 'legacy.auth'])
    ->group(function () {
        Route::get('/dashboard', DashboardController::class);
        Route::get('/account/settings', AccountSettingsController::class);

        Route::get('/lookups/users', [LookupController::class, 'medicalUsers']);
        Route::get('/lookups/medical-users', [LookupController::class, 'medicalUsers']);

        Route::get('/medical-records', [MedicalRecordController::class, 'index']);
        Route::get('/medical-records/{recordId}', [MedicalRecordController::class, 'show']);
        Route::post('/medical-records', [MedicalRecordController::class, 'store']);
        Route::put('/medical-records/{recordId}', [MedicalRecordController::class, 'update']);
        Route::delete('/medical-records/{recordId}', [MedicalRecordController::class, 'destroy']);

        Route::get('/ems-services', [EmsServiceController::class, 'index']);
        Route::post('/ems-services', [EmsServiceController::class, 'store']);

        Route::get('/pharmacy-recap', [PharmacyRecapController::class, 'index']);
        Route::post('/pharmacy-recap', [PharmacyRecapController::class, 'store']);

        Route::get('/secretary', [SecretaryController::class, 'index']);
        Route::post('/secretary/file-records', [SecretaryController::class, 'storeFileRecord']);
    });
