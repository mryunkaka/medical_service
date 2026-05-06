<?php

namespace Tests\Unit\Support;

use App\Realtime\Contracts\EventPayload;
use PHPUnit\Framework\TestCase;

class ApiResponseTest extends TestCase
{
    public function test_event_payload_contains_standard_keys(): void
    {
        $payload = EventPayload::make('medical-record.saved', ['id' => 99]);

        $this->assertSame('medical-record.saved', $payload['event']);
        $this->assertSame(['id' => 99], $payload['data']);
        $this->assertArrayHasKey('timestamp', $payload);
    }
}
