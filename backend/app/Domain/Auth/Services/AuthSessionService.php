<?php

namespace App\Domain\Auth\Services;

use App\Exceptions\BusinessRuleException;
use App\Models\LegacyUser;
use App\Support\Auth\LegacySession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthSessionService
{
    public function login(Request $request, array $payload): array
    {
        $fullName = trim((string) ($payload['full_name'] ?? ''));
        $pin = trim((string) ($payload['pin'] ?? ''));

        $user = DB::table('user_rh')
            ->where('full_name', $fullName)
            ->limit(1)
            ->first();

        if (!$user || !Hash::check($pin, (string) ($user->pin ?? ''))) {
            throw new BusinessRuleException('Nama atau PIN salah.', 422, [
                'credentials' => ['Nama atau PIN salah.'],
            ]);
        }

        if ((int) ($user->is_verified ?? 0) === 0) {
            throw new BusinessRuleException('Akun belum diverifikasi.', 403);
        }

        if ((int) ($user->is_active ?? 0) === 0) {
            throw new BusinessRuleException('Akun tidak aktif.', 403);
        }

        $activeTokenCount = DB::table('remember_tokens')
            ->where('user_id', (int) $user->id)
            ->where('expired_at', '>', now())
            ->count();

        if ($activeTokenCount > 0 && empty($payload['force_login'])) {
            throw new BusinessRuleException('User masih login di device lain.', 409, [
                'force_login' => ['Gunakan force login untuk menutup device lain.'],
            ], 'warning');
        }

        DB::table('remember_tokens')->where('user_id', (int) $user->id)->delete();

        $legacyUser = LegacyUser::fromRow($user);

        LegacySession::put($request, $legacyUser->toArray());

        $request->session()->regenerate();

        return $this->transformUser($legacyUser);
    }

    public function logout(Request $request): void
    {
        $user = LegacySession::user($request);

        if ($user) {
            DB::table('remember_tokens')->where('user_id', $user->id)->delete();
        }

        LegacySession::forget($request);
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }

    public function current(Request $request): ?array
    {
        $user = LegacySession::user($request);

        return $user ? $this->transformUser($user) : null;
    }

    protected function transformUser(LegacyUser $user): array
    {
        return [
            'id' => $user->id,
            'fullName' => $user->fullName,
            'role' => $user->role,
            'position' => $user->position,
            'division' => $user->division,
            'unitCode' => $user->unitCode,
            'canViewAllUnits' => $user->canViewAllUnits,
        ];
    }
}
