<?php

namespace App\Http\Requests\MedicalRecords;

class UpdateMedicalRecordRequest extends StoreMedicalRecordRequest
{
    public function rules(): array
    {
        $rules = parent::rules();

        $rules['ktp_file'] = ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'];

        return $rules;
    }
}
