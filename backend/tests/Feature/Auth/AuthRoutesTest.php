<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;

class AuthRoutesTest extends TestCase
{
    public function test_auth_status_endpoint_returns_success_payload(): void
    {
        $response = $this->getJson('/api/auth/status');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['authenticated'],
                'errors',
                'meta',
            ]);
    }
}
