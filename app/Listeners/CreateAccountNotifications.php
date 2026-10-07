<?php

namespace App\Listeners;

use App\Services\NotificationService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;

/**
 * Notifikasi in-app yang terkait siklus akun. Laravel meng-auto-discover
 * method "handle*" dan mencocokkannya lewat type-hint event.
 */
class CreateAccountNotifications
{
    public function __construct(protected NotificationService $notifications)
    {
    }

    public function handleRegistered(Registered $event): void
    {
        $this->notifications->send(
            $event->user,
            NotificationService::TYPE_SYSTEM,
            'Selamat datang di Sonaria!',
            'Kami sudah mengirim tautan verifikasi ke emailmu. Klik tautan itu untuk mengaktifkan akunmu sepenuhnya.',
        );
    }

    public function handleVerified(Verified $event): void
    {
        $this->notifications->send(
            $event->user,
            NotificationService::TYPE_SYSTEM,
            'Email berhasil diverifikasi',
            'Terima kasih! Akunmu sekarang sudah terverifikasi dan semua fitur Sonaria terbuka.',
        );
    }
}
