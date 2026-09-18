import React, { useMemo, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import OnboardingGradientBackground from '@/components/onboarding/gradient-background';

function MusicNoteBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#D9A441" strokeWidth="1.6">
      <path d="M9 18V5l10-2v13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-4 4.2-6 7.5-6s6 2 7.5 6" strokeLinecap="round" />
    </svg>
  );
}

function IdIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="12" r="2" />
      <path d="M13 10h5M13 14h5" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c7 0 10.5 7 10.5 7a13.6 13.6 0 0 1-3.1 4M6.6 6.6C3.5 8.5 1.5 12 1.5 12s3.5 7 10.5 7c1.3 0 2.5-.2 3.6-.6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    username: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post('/register');
  }

  const fields: Array<{
    key: keyof typeof data;
    label: string;
    type: string;
    placeholder: string;
    icon: React.ReactNode;
    toggle?: { show: boolean; setShow: (v: boolean) => void };
  }> = [
    { key: 'username', label: 'Username', type: 'text', placeholder: 'gitaris_pemula', icon: <IdIcon /> },
    { key: 'name', label: 'Nama lengkap', type: 'text', placeholder: 'Nama kamu', icon: <UserIcon /> },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'kamu@email.com', icon: <MailIcon /> },
    {
      key: 'password',
      label: 'Password',
      type: showPassword ? 'text' : 'password',
      placeholder: 'Minimal 8 karakter',
      icon: <LockIcon />,
      toggle: { show: showPassword, setShow: setShowPassword },
    },
    {
      key: 'password_confirmation',
      label: 'Konfirmasi password',
      type: showConfirm ? 'text' : 'password',
      placeholder: 'Ulangi password',
      icon: <LockIcon />,
      toggle: { show: showConfirm, setShow: setShowConfirm },
    },
  ];

  const filledCount = useMemo(
    () => Object.values(data).filter((v) => String(v).trim().length > 0).length,
    [data]
  );
  const progress = Math.round((filledCount / fields.length) * 100);

  return (
    <GuestLayout title="Daftar — Sonaria" showNav={false}>
      <style>{`
        @keyframes sonaria-pulse {
          0%, 100% { opacity: .55; transform: scale(1); }
          50% { opacity: .9; transform: scale(1.08); }
        }
        @keyframes sonaria-rise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sonaria-shine {
          from { background-position: -150% 0; }
          to { background-position: 250% 0; }
        }
        .sonaria-rise { animation: sonaria-rise .5s ease both; }
        .sonaria-emblem-glow { animation: sonaria-pulse 2.8s ease-in-out infinite; }
        .sonaria-btn-shine::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,.35) 50%, transparent 60%);
          background-size: 200% 100%;
          animation: sonaria-shine 2.6s ease-in-out infinite;
        }
        .sonaria-progress {
          transition: width .35s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .sonaria-rise, .sonaria-emblem-glow, .sonaria-btn-shine::after { animation: none !important; }
        }
      `}</style>

      <div className="relative overflow-hidden">
        <OnboardingGradientBackground />

        <div className="relative z-10 flex items-center justify-center px-6 py-6">
          <div className="w-full max-w-sm">
            <Link
              href="/"
              className="sonaria-rise mb-2 flex justify-center font-fraunces text-xl text-[#F3EEE2]"
            >
              <img src="/images/logo.png" alt="Sonaria" className="h-26 w-26 justify-center" />
            </Link>

            {/* Emblem */}
            <div
              className="sonaria-rise flex flex-col items-center gap-4 text-center"
              style={{ animationDelay: '.05s' }}
            >
              <div>
                <h1 className="mt-3 font-fraunces text-3xl text-[#F3EEE2]">Mulai perjalananmu</h1>
                <p className="mt-2 font-manrope text-sm text-[#9C93A8]">
                  Setelah ini kamu akan memilih kategori & instrumen musikmu.
                </p>
              </div>
            </div>

            {/* Panel */}
            <div
              className="sonaria-rise relative mt-8 rounded-2xl border border-[#2A2333] bg-[#14101B]/70 p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
              style={{ animationDelay: '.1s' }}
            >
              <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-[#D9A441]/50" />
              <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-[#D9A441]/50" />
              <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#D9A441]/50" />
              <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#D9A441]/50" />

              {/* progress: kelengkapan karakter */}
              <div className="mb-5">
                <div className="mb-1.5 flex items-center justify-between font-manrope text-[11px] uppercase tracking-[0.1em] text-[#9C93A8]">
                  <span>Kelengkapan karakter</span>
                  <span className="text-[#D9A441]">{filledCount}/{fields.length}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1E1826]">
                  <div
                    className="sonaria-progress h-full rounded-full bg-gradient-to-r from-[#D9A441] to-[#4C8C86]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <form onSubmit={submit} className="space-y-4">
                {fields.map((f) => (
                  <div key={f.key}>
                    <label className="mb-1.5 flex items-center gap-1.5 font-manrope text-xs uppercase tracking-[0.1em] text-[#9C93A8]">
                      {f.icon} {f.label}
                    </label>
                    <div className="relative">
                      <input
                        type={f.type}
                        value={data[f.key]}
                        onChange={(e) => setData(f.key, e.target.value)}
                        className="w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-4 py-2.5 font-manrope text-sm text-[#F3EEE2] outline-none transition-shadow focus:border-[#D9A441] focus:shadow-[0_0_0_3px_rgba(217,164,65,0.15)]"
                        style={f.toggle ? { paddingRight: '2.5rem' } : undefined}
                        placeholder={f.placeholder}
                      />
                      {f.toggle && (
                        <button
                          type="button"
                          onClick={() => f.toggle!.setShow(!f.toggle!.show)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C93A8] hover:text-[#D9A441]"
                          aria-label={f.toggle.show ? 'Sembunyikan password' : 'Tampilkan password'}
                        >
                          <EyeIcon open={f.toggle.show} />
                        </button>
                      )}
                    </div>
                    {errors[f.key as keyof typeof data] && (
                      <p className="mt-1.5 text-xs text-[#C1443C]">
                        {errors[f.key as keyof typeof data]}
                      </p>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={processing}
                  className="sonaria-btn-shine relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#D9A441] py-3 font-manrope text-sm font-medium text-[#14101B] transition-transform active:scale-[0.98] disabled:opacity-50"
                >
                  {processing ? 'Memproses...' : (
                    <>
                      Buat Akun <ArrowIcon />
                    </>
                  )}
                </button>
              </form>
            </div>

            <p
              className="sonaria-rise mt-6 text-center font-manrope text-sm text-[#9C93A8]"
              style={{ animationDelay: '.15s' }}
            >
              Sudah punya akun?{' '}
              <Link href="/login" className="text-[#D9A441] hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}