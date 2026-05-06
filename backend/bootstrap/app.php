<?php

use Illuminate\Foundation\Application;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use App\Exceptions\BusinessRuleException;
use App\Http\Middleware\EnsureLegacyAbility;
use App\Http\Middleware\EnsureLegacySession;
use App\Support\Http\ApiResponse;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        $middleware->alias([
            'legacy.auth' => EnsureLegacySession::class,
            'legacy.ability' => EnsureLegacyAbility::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ValidationException $exception, Request $request) {
            if ($request->is('api/*')) {
                return ApiResponse::validation($exception->errors(), 'Validasi request gagal.');
            }
        });

        $exceptions->render(function (AuthenticationException $exception, Request $request) {
            if ($request->is('api/*')) {
                return ApiResponse::error('Unauthorized', null, 401, [
                    'auth' => ['Session login tidak valid.'],
                ]);
            }
        });

        $exceptions->render(function (BusinessRuleException $exception, Request $request) {
            if ($request->is('api/*')) {
                return ApiResponse::error(
                    $exception->getMessage(),
                    null,
                    $exception->getStatus(),
                    $exception->getErrors(),
                    ['toastType' => $exception->getToastType()],
                );
            }
        });

        $exceptions->render(function (\Throwable $exception, Request $request) {
            if ($request->is('api/*')) {
                $status = $exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : 500;

                return ApiResponse::error(
                    config('app.debug') ? $exception->getMessage() : 'Terjadi kesalahan server.',
                    null,
                    $status
                );
            }
        });
    })->create();
