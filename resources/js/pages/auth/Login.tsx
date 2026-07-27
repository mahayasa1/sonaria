import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  function submit(e) {
    e.preventDefault();
    post('/login');
  }

  return (
    <GuestLayout title="Masuk — Sonaria" showNav={false}>
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center px-6">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="font-fraunces text-xl text-[#F3EEE2]">
            Sonaria
          </Link>

          <h1 className="mt-8 font-fraunces text-3xl text-[#F3EEE2]">Selamat datang kembali</h1>
          <p className="mt-2 font-manrope text-sm text-[#9C93A8]">
            Lanjutkan latihan dan kejar level berikutnya.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block font-manrope text-xs uppercase tracking-[0.1em] text-[#9C93A8]">
                Email
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-4 py-2.5 font-manrope text-sm text-[#F3EEE2] outline-none focus:border-[#D9A441]"
                placeholder="kamu@email.com"
              />
              {errors.email && <p className="mt-1.5 text-xs text-[#C1443C]">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-1.5 block font-manrope text-xs uppercase tracking-[0.1em] text-[#9C93A8]">
                Password
              </label>
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-4 py-2.5 font-manrope text-sm text-[#F3EEE2] outline-none focus:border-[#D9A441]"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1.5 text-xs text-[#C1443C]">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-full bg-[#D9A441] py-3 font-manrope text-sm text-[#14101B] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {processing ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="mt-6 text-center font-manrope text-sm text-[#9C93A8]">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#D9A441] hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </GuestLayout>
  );
}
