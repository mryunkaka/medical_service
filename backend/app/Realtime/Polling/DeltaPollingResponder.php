<?php

namespace App\Realtime\Polling;

use App\Realtime\Publishers\RealtimeEventPublisher;

class DeltaPollingResponder
{
    public function __construct(
        protected RealtimeEventPublisher $publisher,
    ) {
    }

    public function payload(?string $since = null): array
    {
        $latest = $this->publisher->latest();

        if (!$latest) {
            return [
                'hasChanges' => false,
                'latestCursor' => now()->toIso8601String(),
                'events' => [],
            ];
        }

        if ($since && ($latest['timestamp'] ?? null) === $since) {
            return [
                'hasChanges' => false,
                'latestCursor' => (string) $latest['timestamp'],
                'events' => [],
            ];
        }

        return [
            'hasChanges' => true,
            'latestCursor' => (string) $latest['timestamp'],
            'events' => [[
                'event' => (string) $latest['event'],
                'data' => $latest['data'] ?? null,
                'meta' => [
                    'toastType' => 'info',
                    'invalidate' => [],
                ],
            ]],
        ];
    }
}
