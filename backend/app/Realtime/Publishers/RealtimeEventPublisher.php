<?php

namespace App\Realtime\Publishers;

use App\Realtime\Contracts\EventPayload;
use Illuminate\Support\Facades\Cache;

class RealtimeEventPublisher
{
    public function publish(string $event, mixed $data = null): array
    {
        $payload = EventPayload::make($event, $data);
        Cache::put($this->cacheKey(), $payload, now()->addMinutes(10));

        return $payload;
    }

    public function latest(): ?array
    {
        return Cache::get($this->cacheKey());
    }

    protected function cacheKey(): string
    {
        return 'realtime:latest-event';
    }
}
