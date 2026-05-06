<?php

namespace App\Http\Middleware;

use App\Support\Auth\LegacySession;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureLegacyAbility
{
    public function handle(Request $request, Closure $next, string $field, string ...$values): Response
    {
        $user = LegacySession::user($request);

        if (!$user) {
            abort(401, 'Session login tidak valid.');
        }

        $current = match ($field) {
            'role' => $user->role,
            'division' => $user->division,
            'position' => $user->position,
            default => null,
        };

        if ($current === null || !in_array(mb_strtolower($current), array_map('mb_strtolower', $values), true)) {
            abort(403, 'Akses ditolak.');
        }

        return $next($request);
    }
}
