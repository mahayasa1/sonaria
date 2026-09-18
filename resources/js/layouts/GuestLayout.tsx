import React, { ReactNode } from 'react';
import { Head, Link } from '@inertiajs/react';
import { QuestScreen, PixelButton } from '@/components/quest/quest-ui';

/**
 * Layout publik: landing page, login, register.
 *
 * - Landing (showNav=true): tetap pakai QuestScreen (gradient + scanline) + nav lengkap,
 *   tanpa logo di header (branding sudah ada di hero landing).
 * - Auth / login & register (showNav=false): TIDAK punya background sendiri (transparent).
 *   Background full-page (gradient) datang dari halaman Login/Register masing-masing
 *   (via OnboardingGradientBackground), supaya header & konten menyatu tanpa garis batas.
 */
export default function GuestLayout({
  title,
  children,
  showNav = true,
}: {
  title: string;
  children: ReactNode;
  showNav?: boolean;
}) {
  const content = (
    <>
      <Head title={title} />

      <header
        className={`mx-auto flex max-w-6xl items-center px-6 py-6 ${
          showNav ? 'justify-end' : 'justify-center'
        }`}
      >
        {!showNav && (
          <Link href="/" className="flex  items-center gap-2">
            {/* <img src="/images/logo-sonaria.png" alt="Sonaria" className="h-22 w-32" /> */}
          </Link>
        )}

        {showNav && (
          <nav className="flex items-center gap-6 font-[var(--font-pixel-mono)] text-sm text-[#93C5FD]/80">
            <Link href="/login" className="hover:text-[#F3EEE2]">
              Masuk
            </Link>
            <PixelButton as={Link} href="/register" variant="solid">
              Daftar Gratis
            </PixelButton>
          </nav>
        )}
      </header>

      <main>{children}</main>

      <footer className="mx-auto max-w-6xl px-6 py-10 font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/50">
        © {new Date().getFullYear()} Sonaria. Belajar musik, satu birama pada satu waktu.
      </footer>
    </>
  );

  if (!showNav) {
    // Mode auth: tanpa background sendiri, biar gradient dari Login/Register (yang full-page)
    // yang tampil di belakang header, footer, dan konten — jadi menyatu, tanpa seam.
    return <div className="relative min-h-screen text-[#F3EEE2]">{content}</div>;
  }

  // Mode landing: tetap pakai QuestScreen seperti sebelumnya.
  return <QuestScreen>{content}</QuestScreen>;
}