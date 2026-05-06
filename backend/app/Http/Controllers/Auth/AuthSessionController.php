<?php

namespace App\Http\Controllers\Auth;

use App\Domain\Auth\Services\AuthSessionService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Support\Http\ApiResponse;
use Illuminate\Http\Request;

class AuthSessionController extends Controller
{
    public function __construct(
        protected AuthSessionService $service,
    ) {
    }

    public function login(LoginRequest $request)
    {
        $user = $this->service->login($request, $request->validated());

        return ApiResponse::success($user, 'Login berhasil.', ['toastType' => 'success']);
    }

    public function logout(Request $request)
    {
        $this->service->logout($request);

        return ApiResponse::success(null, 'Logout berhasil.', ['toastType' => 'success']);
    }

    public function me(Request $request)
    {
        return ApiResponse::success($this->service->current($request), 'Data session berhasil dimuat.');
    }

    public function session(Request $request)
    {
        return $this->me($request);
    }

    public function status(Request $request)
    {
        return ApiResponse::success([
            'authenticated' => $this->service->current($request) !== null,
        ], 'Status session berhasil dimuat.');
    }
}
