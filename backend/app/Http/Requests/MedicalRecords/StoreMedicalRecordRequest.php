<?php

namespace App\Http\Requests\MedicalRecords;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMedicalRecordRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'patient_name' => $this->input('patient_name', $this->input('patientName')),
            'patient_citizen_id' => $this->input('patient_citizen_id', $this->input('patientCitizenId')),
            'patient_occupation' => $this->input('patient_occupation', $this->input('patientOccupation')),
            'patient_dob' => $this->input('patient_dob', $this->input('patientDob')),
            'patient_phone' => $this->input('patient_phone', $this->input('patientPhone')),
            'patient_gender' => $this->input('patient_gender', $this->input('patientGender')),
            'patient_address' => $this->input('patient_address', $this->input('patientAddress')),
            'patient_status' => $this->input('patient_status', $this->input('patientStatus')),
            'doctor_id' => $this->input('doctor_id', $this->input('doctorId')),
            'assistant_ids' => $this->input('assistant_ids', $this->input('assistantIds')),
            'operasi_type' => $this->input('operasi_type', $this->input('operasiType')),
            'visibility_scope' => $this->input('visibility_scope', $this->input('visibilityScope')),
            'medical_result_html' => $this->input('medical_result_html', $this->input('medicalResultHtml')),
        ]);
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_name' => ['required', 'string', 'max:255'],
            'patient_citizen_id' => ['required', 'string', 'max:100'],
            'patient_occupation' => ['nullable', 'string', 'max:255'],
            'patient_dob' => ['required', 'date', 'before_or_equal:today', 'after:1900-01-01'],
            'patient_phone' => ['nullable', 'string', 'max:50'],
            'patient_gender' => ['required', Rule::in(['Laki-laki', 'Perempuan'])],
            'patient_address' => ['nullable', 'string', 'max:5000'],
            'patient_status' => ['nullable', 'string', 'max:100'],
            'doctor_id' => ['required', 'integer', 'min:1'],
            'assistant_ids' => ['required', 'array', 'min:1'],
            'assistant_ids.*' => ['integer', 'min:1'],
            'operasi_type' => ['required', Rule::in(['major', 'minor'])],
            'visibility_scope' => ['required', Rule::in(['standard', 'forensic_private'])],
            'medical_result_html' => ['nullable', 'string'],
            'ktp_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'mri_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
