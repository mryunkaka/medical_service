<?php

namespace App\Realtime\Streams;

use App\Realtime\Contracts\EventNames;
use App\Realtime\Publishers\RealtimeEventPublisher;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SseStreamResponder
{
    public function __construct(
        protected RealtimeEventPublisher $publisher,
    ) {
    }

    public function stream(): StreamedResponse
    {
        return response()->stream(function () {
            $latest = $this->publisher->latest() ?? [
                'event' => EventNames::HEARTBEAT,
                'timestamp' => now()->toIso8601String(),
                'data' => ['message' => 'heartbeat'],
            ];

            echo 'event: '.$latest['event'].PHP_EOL;
            echo 'data: '.json_encode($latest, JSON_UNESCAPED_UNICODE).PHP_EOL.PHP_EOL;
            @ob_flush();
            @flush();
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache, no-transform',
            'X-Accel-Buffering' => 'no',
            'Connection' => 'keep-alive',
        ]);
    }
}
