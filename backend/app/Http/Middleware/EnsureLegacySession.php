<?php

namespace App\Http\Middleware;

use App\Support\Auth\LegacySession;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureLegacySession
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!LegacySession::user($request)) {
            abort(401, 'Session login tidak valid.');
        }

        return $next($request);
    }
}
