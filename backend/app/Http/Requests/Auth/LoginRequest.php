<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'full_name' => $this->input('full_name', $this->input('fullName')),
            'login_unit' => $this->input('login_unit', $this->input('loginUnit')),
            'force_login' => $this->boolean('force_login', $this->boolean('forceLogin')),
        ]);
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'pin' => ['required', 'string', 'min:4', 'max:255'],
            'login_unit' => ['nullable', 'string', 'max:50'],
            'force_login' => ['nullable', 'boolean'],
        ];
    }
}
