<?php

namespace App\Support\Http;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(
        mixed $data = null,
        string $message = 'OK',
        array $meta = [],
        int $status = 200,
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'errors' => null,
            'meta' => (object) $meta,
        ], $status);
    }

    public static function paginated(
        LengthAwarePaginator $paginator,
        array $items,
        string $message = 'Data berhasil dimuat.',
        array $meta = [],
    ): JsonResponse {
        return self::success($items, $message, array_merge($meta, [
            'pagination' => [
                'page' => $paginator->currentPage(),
                'perPage' => $paginator->perPage(),
                'total' => $paginator->total(),
                'totalPages' => $paginator->lastPage(),
            ],
        ]));
    }

    public static function error(
        string $message = 'Terjadi kesalahan.',
        mixed $data = null,
        int $status = 422,
        ?array $errors = null,
        array $meta = [],
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => $data,
            'errors' => $errors,
            'meta' => (object) $meta,
        ], $status);
    }

    public static function validation(array $errors, string $message = 'Validasi gagal.'): JsonResponse
    {
        return self::error($message, null, 422, $errors, ['toastType' => 'error']);
    }
}
