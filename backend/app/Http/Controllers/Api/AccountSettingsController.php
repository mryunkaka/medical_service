<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\Auth\LegacySession;
use App\Support\Http\ApiResponse;
use Illuminate\Http\Request;

class AccountSettingsController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = LegacySession::user($request);

        return ApiResponse::success([
            'profile' => [
                'id' => $user?->id ?? 0,
                'fullName' => $user?->fullName ?? '',
                'role' => $user?->role ?? '',
                'position' => $user?->position ?? '',
                'division' => $user?->division ?? '',
                'unitCode' => $user?->unitCode ?? '',
                'email' => $this->buildWorkEmail($user?->fullName),
            ],
            'preferences' => [
                'realtimeNotification' => true,
                'successToast' => true,
                'draftMode' => 'auto_restore',
                'accountMenuAllowed' => true,
            ],
            'accessMatrix' => [
                ['module' => 'Dashboard', 'scope' => 'read', 'allowed' => true],
                ['module' => 'Rekam Medis', 'scope' => 'create_update_upload', 'allowed' => true],
                ['module' => 'Setting Akun', 'scope' => 'self_update', 'allowed' => true],
                ['module' => 'Realtime Event', 'scope' => 'receive_event', 'allowed' => true],
            ],
        ], 'Data account settings berhasil dimuat.');
    }

    protected function buildWorkEmail(?string $fullName): string
    {
        if (!$fullName) {
            return '';
        }

        return preg_replace('/\s+/', '.', strtolower(trim($fullName))).'@medicalservice.local';
    }
}
