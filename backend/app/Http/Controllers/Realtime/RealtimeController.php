<?php

namespace App\Http\Controllers\Realtime;

use App\Http\Controllers\Controller;
use App\Realtime\Polling\DeltaPollingResponder;
use App\Realtime\Streams\SseStreamResponder;
use App\Support\Http\ApiResponse;
use Illuminate\Http\Request;

class RealtimeController extends Controller
{
    public function __construct(
        protected SseStreamResponder $sse,
        protected DeltaPollingResponder $delta,
    ) {
    }

    public function stream()
    {
        return $this->sse->stream();
    }

    public function delta(Request $request)
    {
        return ApiResponse::success(
            $this->delta->payload($request->query('since', $request->query('cursor'))),
            'Delta realtime berhasil dimuat.'
        );
    }
}
