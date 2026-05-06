<?php

namespace App\Http\Requests\Common;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmsServiceRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'patient_name' => $this->input('patient_name', $this->input('patientName')),
            'service_type' => $this->input('service_type', $this->input('serviceType')),
            'service_detail' => $this->input('service_detail', $this->input('serviceDetail')),
            'payment_type' => $this->input('payment_type', $this->input('paymentType')),
            'dpjp_name' => $this->input('dpjp_name', $this->input('dpjpName')),
            'team_names' => $this->input('team_names', $this->input('teamNames')),
            'medicine_usage' => $this->input('medicine_usage', $this->input('medicineUsage')),
        ]);
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_name' => ['nullable', 'string', 'max:100'],
            'service_type' => ['required', Rule::in(['Treatment', 'Pingsan', 'Surat', 'Operasi', 'Rawat Inap', 'Kematian'])],
            'service_detail' => ['required', 'string', 'max:100'],
            'location' => ['required', 'string', 'max:50'],
            'qty' => ['required', 'integer', 'min:1'],
            'payment_type' => ['required', Rule::in(['cash', 'billing'])],
            'dpjp_name' => ['required', 'string', 'max:100'],
            'team_names' => ['nullable', 'array'],
            'team_names.*' => ['string', 'max:100'],
            'medicine_usage' => ['nullable', 'string'],
        ];
    }
}
