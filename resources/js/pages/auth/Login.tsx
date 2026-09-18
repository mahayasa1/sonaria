import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import OnboardingGradientBackground from '@/components/onboarding/gradient-background';


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

// Ikon panah kembali (mengarah ke kiri) untuk tombol "Kembali ke Beranda".
function BackArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword?: boolean }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post('/login');
  }

  return (
    <GuestLayout title="Masuk — Sonaria" showNav={false}>
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
        @media (prefers-reduced-motion: reduce) {
          .sonaria-rise, .sonaria-emblem-glow, .sonaria-btn-shine::after { animation: none !important; }
        }
      `}</style>

      <div className="relative overflow-hidden">
        <OnboardingGradientBackground />

        {/* Tombol kembali ke landing page */}
        <Link
          href="/"
          className="sonaria-rise fixed left-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-[#2A2333] bg-[#14101B]/70 px-3 py-1.5 font-manrope text-xs text-[#9C93A8] backdrop-blur-md transition-colors hover:border-[#D9A441]/50 hover:text-[#D9A441]"
          style={{ animationDelay: '0s' }}
        >
          <BackArrowIcon />
          Kembali ke Beranda
        </Link>

        <div className="relative  items-center justify-center px-6 py-6">
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
              <div className="relative">
                <div className="sonaria-emblem-glow absolute inset-0 rounded-2xl bg-[#D9A441]/30 blur-xl" />
              </div>
              <div>
                <h1 className="mt-3 font-fraunces text-3xl text-[#F3EEE2]">LOGIN</h1>
                {/* <p className="mt-2 font-manrope text-sm text-[#9C93A8]">
                  Lanjutkan latihan dan kejar level berikutnya.
                </p> */}
              </div>
            </div>

            {status && (
              <p
                className="sonaria-rise mt-6 rounded-lg bg-[#4C8C86]/12 px-3 py-2 text-center font-manrope text-sm text-[#4C8C86]"
                style={{ animationDelay: '.1s' }}
              >
                {status}
              </p>
            )}

            {/* Panel */}
            <div
              className="sonaria-rise relative mt-8 rounded-2xl border border-[#2A2333] bg-[#14101B]/70 p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
              style={{ animationDelay: '.15s' }}
            >
              {/* corner brackets */}
              <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-[#D9A441]/50" />
              <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-[#D9A441]/50" />
              <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#D9A441]/50" />
              <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#D9A441]/50" />

              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 font-manrope text-xs uppercase tracking-[0.1em] text-[#9C93A8]">
                    <MailIcon /> Email
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-4 py-2.5 font-manrope text-sm text-[#F3EEE2] outline-none transition-shadow focus:border-[#D9A441] focus:shadow-[0_0_0_3px_rgba(217,164,65,0.15)]"
                    placeholder="kamu@email.com"
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-[#C1443C]">{errors.email}</p>}
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="flex items-center gap-1.5 font-manrope text-xs uppercase tracking-[0.1em] text-[#9C93A8]">
                      <LockIcon /> Password
                    </label>
                    {canResetPassword !== false && (
                      <Link href="/forgot-password" className="font-manrope text-xs text-[#D9A441] hover:underline">
                        Lupa password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className="w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-4 py-2.5 pr-10 font-manrope text-sm text-[#F3EEE2] outline-none transition-shadow focus:border-[#D9A441] focus:shadow-[0_0_0_3px_rgba(217,164,65,0.15)]"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C93A8] hover:text-[#D9A441]"
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-[#C1443C]">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="sonaria-btn-shine relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#D9A441] py-3 font-manrope text-sm font-medium text-[#14101B] transition-transform active:scale-[0.98] disabled:opacity-50"
                >
                  {processing ? 'Memproses...' : (
                    <>
                      Masuk <ArrowIcon />
                    </>
                  )}
                </button>
              </form>
            </div>

            <p
              className="sonaria-rise mt-6 text-center font-manrope text-sm text-[#9C93A8]"
              style={{ animationDelay: '.2s' }}
            >
              Belum punya akun?{' '}
              <Link href="/register" className="text-[#D9A441] hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}