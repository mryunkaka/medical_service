<?php

namespace App\Realtime\Contracts;

class EventPayload
{
    public static function make(string $event, mixed $data = null): array
    {
        return [
            'event' => $event,
            'timestamp' => now()->toIso8601String(),
            'data' => $data,
        ];
    }
}
