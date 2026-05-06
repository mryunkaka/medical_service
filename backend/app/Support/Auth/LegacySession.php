<?php

namespace App\Support\Auth;

use App\Models\LegacyUser;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class LegacySession
{
    public const SESSION_KEY = 'legacy_auth_user';

    public static function put(Request $request, array $payload): void
    {
        $request->session()->put(self::SESSION_KEY, $payload);
    }

    public static function forget(Request $request): void
    {
        $request->session()->forget(self::SESSION_KEY);
    }

    public static function user(Request $request): ?LegacyUser
    {
        $payload = $request->session()->get(self::SESSION_KEY);

        if (!is_array($payload) || (int) Arr::get($payload, 'id', 0) <= 0) {
            return null;
        }

        return LegacyUser::fromSession($payload);
    }
}
