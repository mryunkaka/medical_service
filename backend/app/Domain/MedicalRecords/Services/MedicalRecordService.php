<?php

namespace App\Domain\MedicalRecords\Services;

use App\Domain\MedicalRecords\Queries\MedicalRecordDetailQuery;
use App\Exceptions\BusinessRuleException;
use App\Models\LegacyUser;
use App\Support\Database\LegacyTransaction;
use App\Support\Legacy\LegacySchema;
use App\Uploads\Processors\ImageUploadService;
use App\Uploads\Validators\UploadedFileValidator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MedicalRecordService
{
    public function __construct(
        protected UploadedFileValidator $fileValidator,
        protected ImageUploadService $imageUploadService,
        protected MedicalRecordDetailQuery $detailQuery,
    ) {
    }

    public function store(Request $request, LegacyUser $actor): array
    {
        return LegacyTransaction::run(function () use ($request, $actor) {
            $visibility = (string) $request->string('visibility_scope', 'standard');

            if ($visibility === 'forensic_private' && strcasecmp($actor->division, 'Forensic') !== 0) {
                throw new BusinessRuleException('Akses rekam medis private ditolak.', 403);
            }

            $ktp = $this->fileValidator->validateImage($request->file('ktp_file'), 'KTP', false);
            $mri = $this->fileValidator->validateImage($request->file('mri_file'), 'MRI', false);

            $ktpPayload = $ktp
                ? $this->imageUploadService->storeMedicalRecordFile($ktp, 'ktp')
                : $this->payloadFromFrontendAsset((array) $request->input('ktpFile', []), 'KTP', true);
            $mriPayload = $mri
                ? $this->imageUploadService->storeMedicalRecordFile($mri, 'mri')
                : $this->payloadFromFrontendAsset((array) $request->input('mriFile', []), 'MRI', $visibility === 'forensic_private');

            $assistantIds = collect($request->input('assistant_ids', []))
                ->map(fn ($id) => (int) $id)
                ->filter(fn ($id) => $id > 0)
                ->values()
                ->all();

            if ($assistantIds === []) {
                throw new BusinessRuleException('Asisten operasi wajib diisi minimal 1 orang.');
            }

            $recordId = DB::table('medical_records')->insertGetId([
                'record_code' => 'MR-'.now()->format('Ymd-His').'-'.Str::upper(Str::random(4)),
                'patient_name' => $request->string('patient_name')->toString(),
                'patient_citizen_id' => $request->string('patient_citizen_id')->toString(),
                'patient_occupation' => $request->string('patient_occupation', 'Civilian')->toString(),
                'patient_dob' => $request->string('patient_dob')->toString(),
                'patient_phone' => $request->string('patient_phone')->toString(),
                'patient_gender' => $request->string('patient_gender')->toString(),
                'patient_address' => $request->string('patient_address', 'INDONESIA')->toString(),
                'patient_status' => $request->string('patient_status')->toString(),
                'ktp_file_path' => $ktpPayload->path,
                'mri_file_path' => $mriPayload?->path,
                'medical_result_html' => $this->sanitizeHtml($request->input('medical_result_html')),
                'doctor_id' => (int) $request->input('doctor_id'),
                'assistant_id' => $assistantIds[0],
                'operasi_type' => $request->string('operasi_type')->toString(),
                'visibility_scope' => $visibility,
                'created_by' => $actor->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->syncAssistants($recordId, $assistantIds);

            return $this->detailQuery->findOrFail($recordId);
        });
    }

    public function update(int $recordId, Request $request, LegacyUser $actor): array
    {
        return LegacyTransaction::run(function () use ($recordId, $request, $actor) {
            $current = $this->detailQuery->findOrFail($recordId);

            $canEdit = ((int) ($current['created_by'] ?? 0) === $actor->id)
                || str_contains(mb_strtolower($actor->fullName), 'programmer')
                || str_contains(mb_strtolower($actor->division), 'executive')
                || ($current['visibility_scope'] ?? 'standard') === 'forensic_private' && strcasecmp($actor->division, 'Forensic') === 0;

            if (!$canEdit) {
                throw new BusinessRuleException('Anda tidak memiliki akses edit rekam medis ini.', 403);
            }

            $visibility = (string) $request->string('visibility_scope', (string) ($current['visibility_scope'] ?? 'standard'));
            $ktp = $this->fileValidator->validateImage($request->file('ktp_file'), 'KTP', false);
            $mri = $this->fileValidator->validateImage($request->file('mri_file'), 'MRI', false);

            $assistantIds = collect($request->input('assistant_ids', []))
                ->map(fn ($id) => (int) $id)
                ->filter(fn ($id) => $id > 0)
                ->values()
                ->all();

            if ($assistantIds === []) {
                throw new BusinessRuleException('Asisten operasi wajib diisi minimal 1 orang.');
            }

            $payload = [
                'patient_name' => $request->string('patient_name')->toString(),
                'patient_citizen_id' => $request->string('patient_citizen_id')->toString(),
                'patient_occupation' => $request->string('patient_occupation', 'Civilian')->toString(),
                'patient_dob' => $request->string('patient_dob')->toString(),
                'patient_phone' => $request->string('patient_phone')->toString(),
                'patient_gender' => $request->string('patient_gender')->toString(),
                'patient_address' => $request->string('patient_address', 'INDONESIA')->toString(),
                'patient_status' => $request->string('patient_status')->toString(),
                'medical_result_html' => $this->sanitizeHtml($request->input('medical_result_html')),
                'doctor_id' => (int) $request->input('doctor_id'),
                'assistant_id' => $assistantIds[0],
                'operasi_type' => $request->string('operasi_type')->toString(),
                'visibility_scope' => $visibility,
                'updated_at' => now(),
            ];

            if ($ktp) {
                $payload['ktp_file_path'] = $this->imageUploadService->storeMedicalRecordFile($ktp, 'ktp')->path;
            } elseif ($frontendKtp = $this->pathFromFrontendAsset((array) $request->input('ktpFile', []))) {
                $payload['ktp_file_path'] = $frontendKtp;
            }

            if ($mri) {
                $payload['mri_file_path'] = $this->imageUploadService->storeMedicalRecordFile($mri, 'mri')->path;
            } elseif ($frontendMri = $this->pathFromFrontendAsset((array) $request->input('mriFile', []))) {
                $payload['mri_file_path'] = $frontendMri;
            }

            DB::table('medical_records')->where('id', $recordId)->update($payload);

            $this->syncAssistants($recordId, $assistantIds);

            return $this->detailQuery->findOrFail($recordId);
        });
    }

    public function destroy(int $recordId, LegacyUser $actor): void
    {
        $current = $this->detailQuery->findOrFail($recordId);

        if ((int) ($current['created_by'] ?? 0) !== $actor->id && strcasecmp($actor->division, 'Executive') !== 0) {
            throw new BusinessRuleException('Anda tidak memiliki akses hapus rekam medis ini.', 403);
        }

        LegacyTransaction::run(function () use ($recordId) {
            if (LegacySchema::hasTable('medical_record_assistants')) {
                DB::table('medical_record_assistants')->where('medical_record_id', $recordId)->delete();
            }

            DB::table('medical_records')->where('id', $recordId)->delete();
        });
    }

    protected function syncAssistants(int $recordId, array $assistantIds): void
    {
        if (!LegacySchema::hasTable('medical_record_assistants')) {
            return;
        }

        DB::table('medical_record_assistants')->where('medical_record_id', $recordId)->delete();

        foreach (array_values($assistantIds) as $index => $assistantId) {
            DB::table('medical_record_assistants')->insert([
                'medical_record_id' => $recordId,
                'assistant_user_id' => $assistantId,
                'sort_order' => $index + 1,
            ]);
        }
    }

    protected function sanitizeHtml(mixed $value): string
    {
        return preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', (string) $value) ?? '';
    }

    protected function payloadFromFrontendAsset(array $asset, string $label, bool $required): object
    {
        $path = $this->pathFromFrontendAsset($asset);

        if ($path === null) {
            if ($required) {
                throw new BusinessRuleException("{$label} wajib diupload.");
            }

            return (object) ['path' => null];
        }

        return (object) ['path' => $path];
    }

    protected function pathFromFrontendAsset(array $asset): ?string
    {
        $url = (string) ($asset['fileUrl'] ?? '');

        if ($url === '') {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH);

        if (is_string($path) && str_starts_with($path, '/storage/')) {
            return ltrim($path, '/');
        }

        return str_starts_with($url, '/storage/')
            ? ltrim($url, '/')
            : $url;
    }
}
