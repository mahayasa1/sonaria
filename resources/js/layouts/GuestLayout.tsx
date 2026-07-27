import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Music2 } from 'lucide-react';

/**
 * Layout publik: landing page, login, register.
 * Latar panggung gelap + garis paranada tipis sebagai tekstur ambient.
 */
export default function GuestLayout({ title, children, showNav = true }) {
  return (
    <div className="min-h-screen bg-[#14101B] text-[#F3EEE2]">
      <Head title={title} />

      {showNav && (
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-2">
            <Music2 size={22} className="text-[#D9A441]" />
            <span className="font-fraunces text-xl">Sonaria</span>
          </Link>

          <nav className="flex items-center gap-6 font-manrope text-sm text-[#B7AFC2]">
            <Link href="/login" className="hover:text-[#F3EEE2]">
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#D9A441] px-4 py-2 text-[#14101B] transition-opacity hover:opacity-90"
            >
              Daftar Gratis
            </Link>
          </nav>
        </header>
      )}

      <main>{children}</main>

      <footer className="mx-auto max-w-6xl px-6 py-10 font-manrope text-xs text-[#75708A]">
        © {new Date().getFullYear()} Sonaria. Belajar musik, satu birama pada satu waktu.
      </footer>
    </div>
  );
}
