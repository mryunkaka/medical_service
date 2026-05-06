<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Common\SecretaryFileRecordRequest;
use App\Support\Auth\LegacySession;
use App\Support\Http\ApiResponse;
use Illuminate\Support\Facades\DB;

class SecretaryController extends Controller
{
    public function index()
    {
        $visitAgendas = DB::table('secretary_visit_agendas as agenda')
            ->leftJoin('user_rh as pic', 'pic.id', '=', 'agenda.pic_user_id')
            ->orderByDesc('agenda.visit_date')
            ->limit(25)
            ->get([
                'agenda.*',
                'pic.full_name as pic_name',
            ])->map(fn ($row) => [
            'id' => (int) $row->id,
            'agendaCode' => (string) $row->agenda_code,
            'visitorName' => (string) $row->visitor_name,
            'originName' => (string) $row->origin_name,
            'visitPurpose' => (string) $row->visit_purpose,
            'visitDate' => (string) $row->visit_date,
            'visitTime' => (string) $row->visit_time,
            'location' => (string) $row->location,
            'picName' => (string) ($row->pic_name ?? ''),
            'status' => (string) $row->status,
        ])->all();

        $internalCoordinations = DB::table('secretary_internal_coordinations as coordination')
            ->leftJoin('user_rh as host', 'host.id', '=', 'coordination.host_user_id')
            ->orderByDesc('coordination.coordination_date')
            ->limit(25)
            ->get([
                'coordination.*',
                'host.full_name as host_name',
            ])->map(fn ($row) => [
            'id' => (int) $row->id,
            'coordinationCode' => (string) $row->coordination_code,
            'title' => (string) $row->title,
            'divisionScope' => (string) $row->division_scope,
            'hostName' => (string) ($row->host_name ?? ''),
            'coordinationDate' => (string) $row->coordination_date,
            'startTime' => (string) $row->start_time,
            'status' => (string) $row->status,
            'summaryNotes' => (string) ($row->summary_notes ?? ''),
            'followUpNotes' => (string) ($row->follow_up_notes ?? ''),
        ])->all();

        $confidentialLetters = DB::table('secretary_confidential_letters')->orderByDesc('letter_date')->limit(25)->get()->map(fn ($row) => [
            'id' => (int) $row->id,
            'registerCode' => (string) $row->register_code,
            'referenceNumber' => (string) $row->reference_number,
            'subject' => (string) $row->subject,
            'counterpartyName' => (string) $row->counterparty_name,
            'letterDirection' => (string) $row->letter_direction,
            'confidentialityLevel' => (string) $row->confidentiality_level,
            'letterDate' => (string) $row->letter_date,
            'status' => (string) $row->status,
        ])->all();

        $fileRecords = DB::table('secretary_file_records')->orderByDesc('document_date')->limit(50)->get()->map(fn ($row) => [
            'id' => (int) $row->id,
            'recordCode' => (string) $row->file_code,
            'fileCategory' => (string) $row->file_category,
            'title' => (string) $row->title,
            'counterpartyName' => (string) $row->counterparty_name,
            'documentDate' => (string) $row->document_date,
            'status' => (string) $row->status,
            'keywordSummary' => (string) ($row->keywords ?? ''),
        ])->all();

        return ApiResponse::success([
            'visitAgendas' => $visitAgendas,
            'internalCoordinations' => $internalCoordinations,
            'confidentialLetters' => $confidentialLetters,
            'fileRecords' => $fileRecords,
        ], 'Data secretary berhasil dimuat.');
    }

    public function storeFileRecord(SecretaryFileRecordRequest $request)
    {
        $user = LegacySession::user($request);
        $id = DB::table('secretary_file_records')->insertGetId([
            'file_code' => 'FIL-'.now()->format('ymd').'-'.str_pad((string) random_int(1, 999), 3, '0', STR_PAD_LEFT),
            'file_category' => $request->input('file_category'),
            'reference_number' => 'AUTO/'.now()->format('ymd').'/'.$user?->id,
            'title' => $request->input('title'),
            'counterparty_name' => $request->input('counterparty_name'),
            'document_date' => $request->input('document_date'),
            'status' => $request->input('status'),
            'keywords' => $request->input('keyword_summary'),
            'description' => $request->input('keyword_summary'),
            'created_by' => $user?->id ?? 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $row = DB::table('secretary_file_records')->where('id', $id)->first();

        return ApiResponse::success([
            'id' => (int) $row->id,
            'recordCode' => (string) $row->file_code,
            'fileCategory' => (string) $row->file_category,
            'title' => (string) $row->title,
            'counterpartyName' => (string) $row->counterparty_name,
            'documentDate' => (string) $row->document_date,
            'status' => (string) $row->status,
            'keywordSummary' => (string) ($row->keywords ?? ''),
        ], 'Data file secretary berhasil disimpan.', ['toastType' => 'success'], 201);
    }
}
