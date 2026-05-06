<?php

namespace App\Http\Requests\Common;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SecretaryFileRecordRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'file_category' => $this->input('file_category', $this->input('fileCategory')),
            'counterparty_name' => $this->input('counterparty_name', $this->input('counterpartyName')),
            'document_date' => $this->input('document_date', $this->input('documentDate')),
            'keyword_summary' => $this->input('keyword_summary', $this->input('keywordSummary')),
        ]);
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file_category' => ['required', Rule::in(['proposal', 'cooperation', 'contract', 'report', 'other'])],
            'title' => ['required', 'string', 'max:200'],
            'counterparty_name' => ['required', 'string', 'max:180'],
            'document_date' => ['required', 'date'],
            'status' => ['required', Rule::in(['draft', 'review', 'active', 'archived'])],
            'keyword_summary' => ['nullable', 'string', 'max:255'],
        ];
    }
}
