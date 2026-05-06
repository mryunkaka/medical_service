<?php

namespace App\Domain\MedicalRecords\Queries;

use App\Support\Legacy\LegacySchema;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class MedicalRecordListQuery
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        $query = DB::table('medical_records as r')
            ->leftJoin('user_rh as doctor', 'doctor.id', '=', 'r.doctor_id')
            ->leftJoin('user_rh as creator', 'creator.id', '=', 'r.created_by')
            ->selectRaw('
                r.*,
                doctor.full_name as doctor_name,
                creator.full_name as created_by_name
            ');

        if (LegacySchema::hasColumn('medical_records', 'visibility_scope')) {
            $query->where(DB::raw("COALESCE(r.visibility_scope, 'standard')"), $filters['scope'] ?? 'standard');
        }

        if ($search = trim((string) ($filters['search'] ?? ''))) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('r.patient_name', 'like', "%{$search}%")
                    ->orWhere('r.patient_occupation', 'like', "%{$search}%");

                if (LegacySchema::hasColumn('medical_records', 'patient_citizen_id')) {
                    $builder->orWhere('r.patient_citizen_id', 'like', "%{$search}%");
                }

                if (LegacySchema::hasColumn('medical_records', 'record_code')) {
                    $builder->orWhere('r.record_code', 'like', "%{$search}%");
                }
            });
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('r.created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('r.created_at', '<=', $filters['date_to']);
        }

        $sortBy = (string) ($filters['sort_by'] ?? 'created_at');
        $sortDir = strtolower((string) ($filters['sort_dir'] ?? 'desc')) === 'asc' ? 'asc' : 'desc';
        $allowedSorts = ['created_at', 'patient_name', 'operasi_type', 'record_code'];

        if (!in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'created_at';
        }

        return $query
            ->orderBy('r.'.$sortBy, $sortDir)
            ->paginate((int) ($filters['per_page'] ?? 10))
            ->withQueryString();
    }
}
