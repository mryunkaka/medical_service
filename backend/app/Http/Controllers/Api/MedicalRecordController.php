<?php

namespace App\Http\Controllers\Api;

use App\Domain\MedicalRecords\Queries\MedicalRecordDetailQuery;
use App\Domain\MedicalRecords\Queries\MedicalRecordListQuery;
use App\Domain\MedicalRecords\Services\MedicalRecordService;
use App\Http\Controllers\Controller;
use App\Http\Requests\MedicalRecords\StoreMedicalRecordRequest;
use App\Http\Requests\MedicalRecords\UpdateMedicalRecordRequest;
use App\Realtime\Contracts\EventNames;
use App\Realtime\Publishers\RealtimeEventPublisher;
use App\Support\Auth\LegacySession;
use App\Support\Http\ApiResponse;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    public function __construct(
        protected MedicalRecordListQuery $listQuery,
        protected MedicalRecordDetailQuery $detailQuery,
        protected MedicalRecordService $service,
        protected RealtimeEventPublisher $publisher,
    ) {
    }

    public function index(Request $request)
    {
        $paginator = $this->listQuery->paginate($request->all());

        return ApiResponse::paginated(
            $paginator,
            collect($paginator->items())->map(fn ($row) => $this->transformRecord((array) $row))->all(),
            'Daftar rekam medis berhasil dimuat.'
        );
    }

    public function show(int $recordId)
    {
        return ApiResponse::success(
            $this->transformRecord($this->detailQuery->findOrFail($recordId)),
            'Detail rekam medis berhasil dimuat.'
        );
    }

    public function store(StoreMedicalRecordRequest $request)
    {
        $user = LegacySession::user($request);
        $record = $this->transformRecord($this->service->store($request, $user));
        $this->publisher->publish(EventNames::MEDICAL_RECORD_SAVED, ['id' => $record['id'] ?? null]);

        return ApiResponse::success($record, 'Rekam medis berhasil disimpan.', ['toastType' => 'success'], 201);
    }

    public function update(UpdateMedicalRecordRequest $request, int $recordId)
    {
        $user = LegacySession::user($request);
        $record = $this->transformRecord($this->service->update($recordId, $request, $user));
        $this->publisher->publish(EventNames::MEDICAL_RECORD_SAVED, ['id' => $recordId]);

        return ApiResponse::success($record, 'Rekam medis berhasil diperbarui.', ['toastType' => 'success']);
    }

    public function destroy(Request $request, int $recordId)
    {
        $user = LegacySession::user($request);
        $this->service->destroy($recordId, $user);
        $this->publisher->publish(EventNames::MEDICAL_RECORD_DELETED, ['id' => $recordId]);

        return ApiResponse::success(null, 'Rekam medis berhasil dihapus.', ['toastType' => 'success']);
    }

    protected function transformRecord(array $record): array
    {
        $assistants = collect((array) ($record['assistants'] ?? []));
        $assistantIds = $assistants->pluck('id')->map(fn ($id) => (int) $id)->all();
        $assistantNames = $assistants->pluck('full_name')->map(fn ($name) => (string) $name)->all();
        $recordCode = (string) ($record['record_code'] ?? ('MR-'.str_pad((string) ($record['id'] ?? 0), 6, '0', STR_PAD_LEFT)));

        return [
            'id' => (int) ($record['id'] ?? 0),
            'recordCode' => $recordCode,
            'patientName' => (string) ($record['patient_name'] ?? ''),
            'patientCitizenId' => (string) ($record['patient_citizen_id'] ?? ''),
            'patientOccupation' => (string) ($record['patient_occupation'] ?? ''),
            'patientDob' => (string) ($record['patient_dob'] ?? ''),
            'patientPhone' => (string) ($record['patient_phone'] ?? ''),
            'patientGender' => (string) ($record['patient_gender'] ?? ''),
            'patientAddress' => (string) ($record['patient_address'] ?? ''),
            'patientStatus' => (string) ($record['patient_status'] ?? ''),
            'doctorId' => (int) ($record['doctor_id'] ?? 0),
            'doctorName' => (string) ($record['doctor_name'] ?? ''),
            'assistantIds' => $assistantIds,
            'assistantNames' => $assistantNames,
            'operasiType' => (string) ($record['operasi_type'] ?? 'minor'),
            'visibilityScope' => (string) ($record['visibility_scope'] ?? 'standard'),
            'medicalResultHtml' => (string) ($record['medical_result_html'] ?? ''),
            'ktpFile' => !empty($record['ktp_file_path']) ? [
                'fileId' => 'ktp-'.($record['id'] ?? 0),
                'fileName' => basename((string) $record['ktp_file_path']),
                'fileUrl' => asset('storage/'.ltrim(str_replace('storage/', '', (string) $record['ktp_file_path']), '/')),
                'fileSize' => 0,
                'mimeType' => 'image/jpeg',
            ] : null,
            'mriFile' => !empty($record['mri_file_path']) ? [
                'fileId' => 'mri-'.($record['id'] ?? 0),
                'fileName' => basename((string) $record['mri_file_path']),
                'fileUrl' => asset('storage/'.ltrim(str_replace('storage/', '', (string) $record['mri_file_path']), '/')),
                'fileSize' => 0,
                'mimeType' => 'image/jpeg',
            ] : null,
            'createdBy' => (string) ($record['created_by_name'] ?? ''),
            'createdAt' => (string) ($record['created_at'] ?? ''),
            'updatedAt' => (string) ($record['updated_at'] ?? ''),
        ];
    }
}
