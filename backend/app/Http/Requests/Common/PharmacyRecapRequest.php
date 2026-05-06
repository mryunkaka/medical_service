<?php

namespace App\Http\Requests\Common;

use Illuminate\Foundation\Http\FormRequest;

class PharmacyRecapRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'consumer_name' => $this->input('consumer_name', $this->input('consumerName')),
            'package_name' => $this->input('package_name', $this->input('packageName')),
            'qty_bandage' => $this->input('qty_bandage', $this->input('qtyBandage')),
            'qty_ifaks' => $this->input('qty_ifaks', $this->input('qtyIfaks')),
            'qty_painkiller' => $this->input('qty_painkiller', $this->input('qtyPainkiller')),
            'identity_label' => $this->input('identity_label', $this->input('identityLabel')),
        ]);
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'consumer_name' => ['required', 'string', 'max:100'],
            'package_name' => ['required', 'string', 'max:100'],
            'qty_bandage' => ['required', 'integer', 'min:0'],
            'qty_ifaks' => ['required', 'integer', 'min:0'],
            'qty_painkiller' => ['required', 'integer', 'min:0'],
            'identity_label' => ['required', 'string', 'max:100'],
        ];
    }
}
