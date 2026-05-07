<?php

namespace Tests\Feature\Secretary;

use Illuminate\Support\Facades\DB;
use Tests\Concerns\CreatesLegacySchema;
use Tests\TestCase;

class SecretaryApiLegacySchemaTest extends TestCase
{
    use CreatesLegacySchema;

    protected array $users;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bootLegacyTestDatabaseConnection();
        $this->createLegacyUserTables();
        $this->createSecretaryTables();
        $this->resetLegacySchemaCache();
        $this->users = $this->seedLegacyUsers();

        DB::table('secretary_visit_agendas')->insert([
            'agenda_code' => 'VIS-001',
            'visitor_name' => 'PT Legacy Visit',
            'origin_name' => 'PT Legacy',
            'visit_purpose' => 'Koordinasi kerja sama',
            'visit_date' => '2026-05-07',
            'visit_time' => '10:00:00',
            'location' => 'Meeting Room',
            'pic_user_id' => $this->users['actor']['id'],
            'status' => 'scheduled',
            'created_by' => $this->users['actor']['id'],
            'updated_by' => $this->users['actor']['id'],
        ]);

        DB::table('secretary_internal_coordinations')->insert([
            'coordination_code' => 'INT-001',
            'title' => 'Audit Farmasi',
            'division_scope' => 'Medis',
            'host_user_id' => $this->users['doctor']['id'],
            'coordination_date' => '2026-05-08',
            'start_time' => '13:00:00',
            'status' => 'scheduled',
            'summary_notes' => 'Ringkasan awal',
            'follow_up_notes' => 'Tindak lanjut',
            'created_by' => $this->users['actor']['id'],
            'updated_by' => $this->users['actor']['id'],
        ]);

        DB::table('secretary_confidential_letters')->insert([
            'register_code' => 'SEC-001',
            'reference_number' => 'REF-001',
            'letter_direction' => 'incoming',
            'subject' => 'Surat Rahasia',
            'counterparty_name' => 'Board Office',
            'confidentiality_level' => 'secret',
            'letter_date' => '2026-05-06',
            'status' => 'logged',
            'created_by' => $this->users['actor']['id'],
            'updated_by' => $this->users['actor']['id'],
        ]);

        DB::table('secretary_file_records')->insert([
            'file_code' => 'FIL-001',
            'file_category' => 'proposal',
            'reference_number' => 'FILE-REF-001',
            'title' => 'Proposal Legacy',
            'counterparty_name' => 'PT Legacy',
            'document_date' => '2026-05-04',
            'status' => 'review',
            'keywords' => 'proposal,legacy',
            'description' => 'Dokumen legacy',
            'created_by' => $this->users['actor']['id'],
            'updated_by' => $this->users['actor']['id'],
        ]);
    }

    public function test_secretary_index_works_against_real_legacy_column_names(): void
    {
        $response = $this
            ->withSession($this->withLegacySession($this->users['actor']))
            ->withHeader('Accept', 'application/json')
            ->get('/api/secretary');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.visitAgendas.0.picName', 'AHMAD MILLER')
            ->assertJsonPath('data.internalCoordinations.0.hostName', 'Dr. Ollie Hexagonal')
            ->assertJsonPath('data.confidentialLetters.0.registerCode', 'SEC-001')
            ->assertJsonPath('data.fileRecords.0.recordCode', 'FIL-001');
    }
}
