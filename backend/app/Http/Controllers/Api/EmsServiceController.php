<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Common\EmsServiceRequest;
use App\Support\Auth\LegacySession;
use App\Support\Http\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmsServiceController extends Controller
{
    public function index(Request $request)
    {
        $search = (string) $request->query('search', '');
        $type = (string) $request->query('type', '');

        $query = DB::table('ems_sales')->orderByDesc('created_at');

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('patient_name', 'like', "%{$search}%")
                    ->orWhere('medic_name', 'like', "%{$search}%")
                    ->orWhere('service_detail', 'like', "%{$search}%");
            });
        }

        if ($type !== '') {
            $query->where('service_type', $type);
        }

        $data = $query->limit(100)->get()->map(function ($row) {
            return [
                'id' => (int) $row->id,
                'serviceCode' => 'EMS-'.str_pad((string) $row->id, 4, '0', STR_PAD_LEFT),
                'patientName' => (string) ($row->patient_name ?? '-'),
                'serviceType' => (string) $row->service_type,
                'serviceDetail' => (string) $row->service_detail,
                'location' => (string) $row->location,
                'qty' => (int) $row->qty,
                'paymentType' => (string) ($row->payment_type ?? 'cash'),
                'dpjpName' => (string) $row->medic_name,
                'teamNames' => [],
                'medicineUsage' => (string) ($row->medicine_usage ?? ''),
                'total' => (int) $row->total,
                'createdAt' => (string) $row->created_at,
            ];
        })->all();

        return ApiResponse::success($data, 'Data EMS services berhasil dimuat.');
    }

    public function store(EmsServiceRequest $request)
    {
        $user = LegacySession::user($request);

        $prices = [
            'Operasi' => 2_500_000,
            'Rawat Inap' => 850_000,
        ];

        $price = $prices[$request->input('service_type')] ?? 450_000;
        $qty = (int) $request->input('qty', 1);
        $id = DB::table('ems_sales')->insertGetId([
            'service_type' => $request->input('service_type'),
            'service_detail' => $request->input('service_detail'),
            'medicine_usage' => $request->input('medicine_usage'),
            'patient_name' => $request->input('patient_name'),
            'location' => $request->input('location'),
            'qty' => $qty,
            'price' => $price,
            'total' => $price * $qty,
            'payment_type' => $request->input('payment_type'),
            'medic_name' => $request->input('dpjp_name', $user?->fullName ?? ''),
            'medic_jabatan' => $user?->position ?? '',
            'created_at' => now(),
            'unit_code' => $user?->unitCode ?? 'roxwood',
        ]);

        return ApiResponse::success([
            'id' => $id,
            'serviceCode' => 'EMS-'.str_pad((string) $id, 4, '0', STR_PAD_LEFT),
            'patientName' => (string) $request->input('patient_name', '-'),
            'serviceType' => (string) $request->input('service_type'),
            'serviceDetail' => (string) $request->input('service_detail'),
            'location' => (string) $request->input('location'),
            'qty' => $qty,
            'paymentType' => (string) $request->input('payment_type'),
            'dpjpName' => (string) $request->input('dpjp_name', $user?->fullName ?? ''),
            'teamNames' => (array) $request->input('team_names', []),
            'medicineUsage' => (string) $request->input('medicine_usage', ''),
            'total' => $price * $qty,
            'createdAt' => now()->toIso8601String(),
        ], 'Data EMS services berhasil disimpan.', ['toastType' => 'success'], 201);
    }
}
