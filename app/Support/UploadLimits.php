<?php

namespace App\Support;

/**
 * Batas ukuran file berlaku di seluruh aplikasi (profile photo, video
 * practice/challenge submission, dsb). Satu sumber angka supaya konsisten
 * dan gampang diubah di satu tempat.
 */
final class UploadLimits
{
    public const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

    public const MAX_KILOBYTES = 100 * 1024; // dipakai rule Laravel 'max' untuk file (satuan KB)

    public static function humanReadable(): string
    {
        return '100MB';
    }
}
