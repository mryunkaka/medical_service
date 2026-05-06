<?php

namespace App\Domain\MedicalRecords\Queries;

use App\Exceptions\BusinessRuleException;
use App\Support\Legacy\LegacySchema;
use Illuminate\Support\Facades\DB;

class MedicalRecordDetailQuery
{
    public function findOrFail(int $id): array
    {
        $record = DB::table('medical_records as r')
            ->leftJoin('user_rh as doctor', 'doctor.id', '=', 'r.doctor_id')
            ->leftJoin('user_rh as creator', 'creator.id', '=', 'r.created_by')
            ->selectRaw('
                r.*,
                doctor.full_name as doctor_name,
                creator.full_name as created_by_name
            ')
            ->where('r.id', $id)
            ->first();

        if (!$record) {
            throw new BusinessRuleException('Rekam medis tidak ditemukan.', 404);
        }

        $assistants = [];

        if (LegacySchema::hasTable('medical_record_assistants')) {
            $assistants = DB::table('medical_record_assistants as mra')
                ->join('user_rh as u', 'u.id', '=', 'mra.assistant_user_id')
                ->where('mra.medical_record_id', $id)
                ->orderBy('mra.sort_order')
                ->get(['u.id', 'u.full_name'])
                ->map(fn ($row) => ['id' => (int) $row->id, 'full_name' => (string) $row->full_name])
                ->all();
        }

        return array_merge((array) $record, [
            'assistants' => $assistants,
        ]);
    }
}
