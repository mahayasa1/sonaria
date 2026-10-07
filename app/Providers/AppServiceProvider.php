<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureVerificationEmail();
    }

    /**
     * Isi email verifikasi (dikirim Fortify saat registrasi / kirim ulang)
     * dalam bahasa Indonesia.
     */
    protected function configureVerificationEmail(): void
    {
        VerifyEmail::toMailUsing(function (object $notifiable, string $url): MailMessage {
            $expire = config('auth.verification.expire', 60);

            return (new MailMessage)
                ->subject('Verifikasi Email Akun Sonaria')
                ->greeting("Halo, {$notifiable->name}!")
                ->line('Terima kasih sudah bergabung di Sonaria. Klik tombol di bawah untuk memverifikasi alamat emailmu.')
                ->action('Verifikasi Email', $url)
                ->line("Tautan ini berlaku selama {$expire} menit.")
                ->line('Kalau kamu tidak merasa mendaftar di Sonaria, abaikan saja email ini.');
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(8)
            : null
        );
    }
}
