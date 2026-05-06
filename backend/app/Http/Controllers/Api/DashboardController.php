<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\Http\ApiResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $medicalRecords = (int) DB::table('medical_records')->count();
        $majorOperations = (int) DB::table('medical_records')->where('operasi_type', 'major')->count();
        $emsServices = (int) DB::table('ems_sales')->whereDate('created_at', today())->count();
        $pharmacyDrafts = (int) DB::table('sales')->count();

        return ApiResponse::success([
            'summaryCards' => [
                ['label' => 'Total Rekam Medis', 'value' => $medicalRecords, 'tone' => 'brand'],
                ['label' => 'Operasi Mayor', 'value' => $majorOperations, 'tone' => 'danger'],
                ['label' => 'EMS Services Hari Ini', 'value' => $emsServices, 'tone' => 'warning'],
                ['label' => 'Rekap Farmasi Aktif', 'value' => $pharmacyDrafts, 'tone' => 'success'],
            ],
            'quickActions' => [
                ['title' => 'Tambah Rekam Medis', 'href' => '/medical-records'],
                ['title' => 'Input EMS Services', 'href' => '/ems-services'],
                ['title' => 'Review Rekap Farmasi', 'href' => '/pharmacy-recap'],
            ],
        ], 'Dashboard berhasil dimuat.');
    }
}
