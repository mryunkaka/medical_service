<?php

namespace App\Http\Controllers\Api;

use App\Domain\SharedLookup\Queries\UserLookupQuery;
use App\Http\Controllers\Controller;
use App\Support\Http\ApiResponse;
use Illuminate\Http\Request;

class LookupController extends Controller
{
    public function __construct(
        protected UserLookupQuery $users,
    ) {
    }

    public function medicalUsers(Request $request)
    {
        return ApiResponse::success(
            $this->users->searchMedicalUsers((string) $request->query('q', $request->query('search', '')), (string) $request->query('scope', 'all')),
            'Lookup user berhasil dimuat.'
        );
    }
}
