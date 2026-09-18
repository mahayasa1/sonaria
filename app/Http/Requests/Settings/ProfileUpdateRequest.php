<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use Illuminate\Foundation\Http\FormRequest;

/**
 * ⚠️ File ini hasil rekonstruksi karena isi aslinya tidak tersedia.
 * Kalau file asli kamu punya authorize()/messages() custom, gabungkan
 * saja — bagian yang penting cuma rules() memanggil profileRules().
 */
class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>|string>
     */
    public function rules(): array
    {
        return $this->profileRules($this->user()->users_id);
    }
}