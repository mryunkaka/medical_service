<?php

namespace Tests\Feature\MedicalRecords;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\CreatesLegacySchema;
use Tests\TestCase;

class MedicalRecordApiLegacySchemaTest extends TestCase
{
    use CreatesLegacySchema;

    protected array $users;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bootLegacyTestDatabaseConnection();
        $this->createLegacyUserTables();
        $this->createMedicalRecordTables();
        $this->resetLegacySchemaCache();
        $this->users = $this->seedLegacyUsers();
        Storage::fake('public');
    }

    public function test_medical_record_crud_works_with_legacy_schema_and_multipart_upload(): void
    {
        $createResponse = $this
            ->withSession($this->withLegacySession($this->users['actor']))
            ->withHeader('Accept', 'application/json')
            ->post('/api/medical-records', [
                'patientName' => 'QA Legacy Patient',
                'patientCitizenId' => '3201998877665544',
                'patientOccupation' => 'Tester',
                'patientDob' => '1990-02-01',
                'patientPhone' => '081234567891',
                'patientGender' => 'Laki-laki',
                'patientAddress' => 'Jl Legacy QA',
                'patientStatus' => 'Rawat jalan',
                'doctorId' => $this->users['doctor']['id'],
                'assistantIds' => [$this->users['assistant']['id']],
                'operasiType' => 'minor',
                'visibilityScope' => 'standard',
                'medicalResultHtml' => '<p>QA legacy create</p>',
                'ktp_file' => UploadedFile::fake()->image('ktp.png', 2800, 2200),
                'mri_file' => UploadedFile::fake()->image('mri.jpg', 2600, 2000),
            ]);

        $createResponse
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.patientName', 'QA Legacy Patient');

        $recordId = $createResponse->json('data.id');
        $storedRecord = DB::table('medical_records')->where('id', $recordId)->first();

        $this->assertNotNull($storedRecord);
        $this->assertNotNull($storedRecord->ktp_file_path);
        $this->assertNotNull($storedRecord->mri_file_path);
        Storage::disk('public')->assertExists($storedRecord->ktp_file_path);
        Storage::disk('public')->assertExists($storedRecord->mri_file_path);

        [$ktpWidth, $ktpHeight] = getimagesize(Storage::disk('public')->path($storedRecord->ktp_file_path));
        $this->assertLessThanOrEqual(1800, max($ktpWidth, $ktpHeight));

        $updateResponse = $this
            ->withSession($this->withLegacySession($this->users['actor']))
            ->withHeader('Accept', 'application/json')
            ->post("/api/medical-records/{$recordId}", [
                '_method' => 'PUT',
                'patientName' => 'QA Legacy Patient Updated',
                'patientCitizenId' => '3201998877665544',
                'patientOccupation' => 'Senior Tester',
                'patientDob' => '1990-02-01',
                'patientPhone' => '081234567891',
                'patientGender' => 'Laki-laki',
                'patientAddress' => 'Jl Legacy QA Update',
                'patientStatus' => 'Rawat jalan',
                'doctorId' => $this->users['doctor']['id'],
                'assistantIds' => [$this->users['assistant']['id']],
                'operasiType' => 'major',
                'visibilityScope' => 'standard',
                'medicalResultHtml' => '<p>QA legacy update</p>',
                'ktpFile' => [
                    'fileUrl' => $createResponse->json('data.ktpFile.fileUrl'),
                    'fileName' => $createResponse->json('data.ktpFile.fileName'),
                    'fileSize' => $createResponse->json('data.ktpFile.fileSize'),
                    'mimeType' => $createResponse->json('data.ktpFile.mimeType'),
                ],
                'mriFile' => [
                    'fileUrl' => $createResponse->json('data.mriFile.fileUrl'),
                    'fileName' => $createResponse->json('data.mriFile.fileName'),
                    'fileSize' => $createResponse->json('data.mriFile.fileSize'),
                    'mimeType' => $createResponse->json('data.mriFile.mimeType'),
                ],
            ]);

        $updateResponse
            ->assertOk()
            ->assertJsonPath('data.patientName', 'QA Legacy Patient Updated')
            ->assertJsonPath('data.operasiType', 'major');

        $listResponse = $this
            ->withSession($this->withLegacySession($this->users['actor']))
            ->withHeader('Accept', 'application/json')
            ->get('/api/medical-records?search=QA%20Legacy%20Patient%20Updated&scope=standard');

        $listResponse
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data');

        $deleteResponse = $this
            ->withSession($this->withLegacySession($this->users['actor']))
            ->withHeader('Accept', 'application/json')
            ->delete("/api/medical-records/{$recordId}");

        $deleteResponse
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('medical_records', [
            'id' => $recordId,
        ]);
    }
}
