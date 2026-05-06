<?php

namespace App\Domain\SharedLookup\Queries;

use Illuminate\Support\Facades\DB;

class UserLookupQuery
{
    public function searchMedicalUsers(string $keyword = '', string $scope = 'all'): array
    {
        $query = DB::table('user_rh')
            ->select(['id', 'full_name', 'position', 'division', 'role', 'batch'])
            ->where('is_active', 1)
            ->orderBy('full_name')
            ->limit(25);

        if ($keyword !== '') {
            $query->where('full_name', 'like', "%{$keyword}%");
        }

        if ($scope === 'doctor') {
            $query->where(function ($builder) {
                $builder->where('position', 'like', '%doctor%')
                    ->orWhere('position', 'like', '%dokter%')
                    ->orWhere('position', 'like', '%specialist%');
            });
        }

        if ($scope === 'assistant') {
            $query->where(function ($builder) {
                $builder->where('position', 'like', '%assistant%')
                    ->orWhere('position', 'like', '%co_asst%')
                    ->orWhere('position', 'like', '%paramedic%');
            });
        }

        return $query->get()
            ->map(fn ($row) => [
                'value' => (string) $row->id,
                'label' => (string) $row->full_name,
                'meta' => [
                    'fullName' => (string) $row->full_name,
                    'position' => (string) ($row->position ?? ''),
                    'division' => (string) ($row->division ?? ''),
                    'batch' => $row->batch ? (int) $row->batch : null,
                ],
            ])
            ->all();
    }
}
