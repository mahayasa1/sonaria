import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    username: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  function submit(e) {
    e.preventDefault();
    post('/register');
  }

  const fields = [
    { key: 'username', label: 'Username', type: 'text', placeholder: 'gitaris_pemula' },
    { key: 'name', label: 'Nama lengkap', type: 'text', placeholder: 'Nama kamu' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'kamu@email.com' },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Minimal 8 karakter' },
    { key: 'password_confirmation', label: 'Konfirmasi password', type: 'password', placeholder: 'Ulangi password' },
  ];

  return (
    <GuestLayout title="Daftar — Sonaria" showNav={false}>
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center px-6 py-10">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="font-fraunces text-xl text-[#F3EEE2]">
            Sonaria
          </Link>

          <h1 className="mt-8 font-fraunces text-3xl text-[#F3EEE2]">Mulai perjalananmu</h1>
          <p className="mt-2 font-manrope text-sm text-[#9C93A8]">
            Setelah ini kamu akan memilih kategori & instrumen musikmu.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="mb-1.5 block font-manrope text-xs uppercase tracking-[0.1em] text-[#9C93A8]">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={data[f.key]}
                  onChange={(e) => setData(f.key, e.target.value)}
                  className="w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-4 py-2.5 font-manrope text-sm text-[#F3EEE2] outline-none focus:border-[#D9A441]"
                  placeholder={f.placeholder}
                />
                {errors[f.key] && <p className="mt-1.5 text-xs text-[#C1443C]">{errors[f.key]}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-full bg-[#D9A441] py-3 font-manrope text-sm text-[#14101B] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {processing ? 'Memproses...' : 'Buat Akun'}
            </button>
          </form>

          <p className="mt-6 text-center font-manrope text-sm text-[#9C93A8]">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#D9A441] hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </GuestLayout>
  );
}
