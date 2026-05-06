<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Common\PharmacyRecapRequest;
use App\Support\Auth\LegacySession;
use App\Support\Http\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PharmacyRecapController extends Controller
{
    public function index(Request $request)
    {
        $search = (string) $request->query('search', '');

        $query = DB::table('sales')->orderByDesc('created_at');

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('consumer_name', 'like', "%{$search}%")
                    ->orWhere('package_name', 'like', "%{$search}%")
                    ->orWhere('medic_name', 'like', "%{$search}%");
            });
        }

        $data = $query->limit(100)->get()->map(fn ($row) => [
            'id' => (int) $row->id,
            'saleCode' => 'FAR-'.str_pad((string) $row->id, 4, '0', STR_PAD_LEFT),
            'consumerName' => (string) $row->consumer_name,
            'packageName' => (string) $row->package_name,
            'qtyBandage' => (int) $row->qty_bandage,
            'qtyIfaks' => (int) $row->qty_ifaks,
            'qtyPainkiller' => (int) $row->qty_painkiller,
            'medicName' => (string) $row->medic_name,
            'identityLabel' => 'General',
            'createdAt' => (string) $row->created_at,
            'status' => 'draft',
        ])->all();

        return ApiResponse::success($data, 'Rekap farmasi berhasil dimuat.');
    }

    public function store(PharmacyRecapRequest $request)
    {
        $user = LegacySession::user($request);
        $hash = hash('sha256', Str::uuid()->toString());
        $id = DB::table('sales')->insertGetId([
            'consumer_name' => $request->input('consumer_name'),
            'medic_name' => $user?->fullName ?? 'Unknown',
            'medic_user_id' => $user?->id,
            'medic_jabatan' => $user?->position ?? '',
            'unit_code' => $user?->unitCode ?? 'roxwood',
            'package_id' => 0,
            'package_name' => $request->input('package_name'),
            'price' => 0,
            'qty_bandage' => (int) $request->input('qty_bandage'),
            'qty_ifaks' => (int) $request->input('qty_ifaks'),
            'qty_painkiller' => (int) $request->input('qty_painkiller'),
            'keterangan' => $request->input('identity_label'),
            'created_at' => now(),
            'tx_hash' => $hash,
        ]);

        return ApiResponse::success([
            'id' => $id,
            'saleCode' => 'FAR-'.str_pad((string) $id, 4, '0', STR_PAD_LEFT),
            'consumerName' => (string) $request->input('consumer_name'),
            'packageName' => (string) $request->input('package_name'),
            'qtyBandage' => (int) $request->input('qty_bandage'),
            'qtyIfaks' => (int) $request->input('qty_ifaks'),
            'qtyPainkiller' => (int) $request->input('qty_painkiller'),
            'medicName' => $user?->fullName ?? 'Unknown',
            'identityLabel' => (string) $request->input('identity_label'),
            'createdAt' => now()->toIso8601String(),
            'status' => 'draft',
        ], 'Input rekap farmasi berhasil disimpan.', ['toastType' => 'success'], 201);
    }
}
