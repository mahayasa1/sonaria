<?php

namespace App\Concerns;

use App\Models\User;
use App\Support\UploadLimits;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($userId),
            'photo' => $this->photoRules(),
            'gender' => $this->genderRules(),
            'birth_date' => $this->birthDateRules(),
            'phone' => $this->phoneRules(),
            'address' => $this->addressRules(),
            'province' => $this->provinceRules(),
            'city' => $this->cityRules(),
        ];
    }

    /**
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function photoRules(): array
    {
        return ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:'.UploadLimits::MAX_KILOBYTES];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId, 'users_id'),
        ];
    }

    /**
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function genderRules(): array
    {
        // ⚠️ Sesuaikan daftar opsinya kalau ada nilai lain selain Male/Female.
        return ['nullable', 'string', Rule::in(['Male', 'Female'])];
    }

    /**
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function birthDateRules(): array
    {
        return ['nullable', 'date', 'before:today'];
    }

    /**
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function phoneRules(): array
    {
        return ['nullable', 'string', 'max:20'];
    }

    /**
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function addressRules(): array
    {
        return ['nullable', 'string', 'max:500'];
    }

    /**
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function provinceRules(): array
    {
        return ['nullable', 'string', 'max:255'];
    }

    /**
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function cityRules(): array
    {
        return ['nullable', 'string', 'max:255'];
    }
}