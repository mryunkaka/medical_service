<?php

namespace Tests\Unit\Support;

use App\Realtime\Contracts\EventPayload;
use PHPUnit\Framework\TestCase;

class ApiResponseTest extends TestCase
{
    public function test_event_payload_contains_standard_keys(): void
    {
        $payload = EventPayload::make('medical-record.updated', ['recordId' => '99'], ['toastType' => 'success']);

        $this->assertSame('medical-record.updated', $payload['event']);
        $this->assertSame(['recordId' => '99'], $payload['data']);
        $this->assertSame(['toastType' => 'success'], $payload['meta']);
        $this->assertArrayHasKey('timestamp', $payload);
    }
}
