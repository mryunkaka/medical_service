<?php

namespace App\Http\Requests\Common;

use Illuminate\Foundation\Http\FormRequest;

class PaginatedIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:500'],
            'page' => ['nullable', 'integer', 'min:1'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date'],
            'sort_by' => ['nullable', 'string'],
            'sort_dir' => ['nullable', 'in:asc,desc'],
        ];
    }
}
