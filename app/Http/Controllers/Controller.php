<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

// Catatan: base Controller default Laravel 13 tidak lagi otomatis menyertakan
// AuthorizesRequests/ValidatesRequests. Trait ini ditambahkan manual di sini
// supaya $this->authorize(...) di semua controller Api/* bisa dipakai.
abstract class Controller
{
    use AuthorizesRequests, ValidatesRequests;
}
