<?php

namespace Tests\Feature\Realtime;

use App\Realtime\Publishers\RealtimeEventPublisher;
use Illuminate\Support\Facades\Cache;
use Tests\Concerns\CreatesLegacySchema;
use Tests\TestCase;

class RealtimeDeltaLegacyEventTest extends TestCase
{
    use CreatesLegacySchema;

    protected array $users;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bootLegacyTestDatabaseConnection();
        $this->createLegacyUserTables();
        $this->resetLegacySchemaCache();
        $this->users = $this->seedLegacyUsers();
        Cache::flush();
    }

    public function test_delta_returns_latest_event_with_invalidation_meta(): void
    {
        app(RealtimeEventPublisher::class)->publish(
            'medical-record.updated',
            [
                'module' => 'medical-records',
                'recordId' => '101',
                'action' => 'updated',
                'actorId' => '2',
            ],
            [
                'toastType' => 'success',
                'invalidate' => ['dashboard', 'medical-records', 'medical-records:detail:101'],
            ],
        );

        $response = $this
            ->withSession($this->withLegacySession($this->users['actor']))
            ->withHeader('Accept', 'application/json')
            ->get('/api/realtime/delta');

        $response
            ->assertOk()
            ->assertJsonPath('data.hasChanges', true)
            ->assertJsonPath('data.events.0.event', 'medical-record.updated')
            ->assertJsonPath('data.events.0.meta.toastType', 'success')
            ->assertJsonPath('data.events.0.meta.invalidate.1', 'medical-records');
    }
}
