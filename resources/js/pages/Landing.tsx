import React from 'react';
import { Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { Swords, Flame, Trophy, MessageSquare } from 'lucide-react';

const CATEGORIES = [
  { name: 'Percussion', desc: 'Drum, kendang, marimba — rasakan ketukan.' },
  { name: 'Woodwind', desc: 'Seruling, klarinet, saksofon — kuasai napas.' },
  { name: 'Brass', desc: 'Trompet, trombon, French horn — kuatkan embusan.' },
  { name: 'String', desc: 'Gitar, biola, cello — latih jari & gesekan.' },
];

const FEATURES = [
  {
    icon: Swords,
    accent: '#D9A441',
    title: 'Main Quest, 7 Birama',
    desc: 'Tujuh level pembelajaran berjenjang: materi, quiz, lalu unggah video latihanmu. Reward XP naik setiap birama.',
  },
  {
    icon: Flame,
    accent: '#C1443C',
    title: 'Daily Mission',
    desc: 'Enam kuis harian ringan dari komunitasmu. Cepat dikerjakan, XP kejutan menanti di setiap penyelesaian.',
  },
  {
    icon: Trophy,
    accent: '#D9A441',
    title: 'Challenge Komunitas',
    desc: 'Satu misi video unjuk kemampuan yang sedang berlangsung, dengan reward XP terbesar di komunitas.',
  },
  {
    icon: MessageSquare,
    accent: '#4C8C86',
    title: 'Forum Diskusi',
    desc: 'Tempat bertukar teknik, bertanya, dan merayakan progres bersama sesama anggota komunitas.',
  },
];

function Landing() {
  return (
    <GuestLayout title="Sonaria — Komunitas Belajar Musik">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-20 pt-10">
        <div className="mx-auto max-w-6xl">
          {/* paranada dekoratif di belakang headline */}
          <div className="pointer-events-none absolute left-1/2 top-24 h-40 w-[130%] -translate-x-1/2 opacity-40">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-px w-full bg-[#332B40]" style={{ marginTop: i === 0 ? 0 : '2.2rem' }} />
            ))}
          </div>

          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-4 font-manrope text-xs uppercase tracking-[0.22em] text-[#D9A441]">
                Belajar alat musik, level demi level
              </p>
              <h1 className="font-fraunces text-5xl leading-[1.05] text-[#F3EEE2] md:text-6xl">
                Naik level
                <br />
                setiap kali
                <br />
                <span className="italic text-[#D9A441]">kau berlatih.</span>
              </h1>
              <p className="mt-6 max-w-md font-manrope text-[#B7AFC2]">
                Sonaria mengubah proses belajar alat musik jadi perjalanan berjenjang:
                pilih instrumenmu, gabung komunitas, dan kumpulkan XP dari materi,
                quiz, hingga video latihan yang dinilai langsung oleh komunitasmu.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/register"
                  className="rounded-full bg-[#D9A441] px-6 py-3 font-manrope text-sm text-[#14101B] transition-opacity hover:opacity-90"
                >
                  Mulai Perjalananmu
                </Link>
                <Link href="/login" className="font-manrope text-sm text-[#B7AFC2] hover:text-[#F3EEE2]">
                  Sudah punya akun? Masuk →
                </Link>
              </div>
            </div>

            {/* Kartu level sebagai bukti sosial ringkas */}
            <div className="relative mx-auto w-full max-w-sm rounded-2xl border border-[#2A2333] bg-[#1E1826] p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
                  Progres komunitas
                </span>
                <span className="font-mono text-xs text-[#D9A441]">Level 4 / 7</span>
              </div>
              <div className="space-y-3">
                {['Materi Fingering Dasar', 'Quiz Tangga Nada', 'Video Latihan Etude I'].map((t, idx) => (
                  <div key={t} className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: idx < 2 ? '#4C8C86' : '#D9A441' }}
                    />
                    <span className="font-manrope text-sm text-[#D9CFE8]">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORI ALAT MUSIK */}
      <section className="border-y border-[#2A2333] bg-[#191220] px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-fraunces text-2xl text-[#F3EEE2]">Empat jalur, satu panggung</h2>
          <p className="mt-2 max-w-lg font-manrope text-sm text-[#9C93A8]">
            Pilih kategori alat musikmu untuk menemukan komunitas dan materi yang sesuai.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <div
                key={c.name}
                className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-5 transition-colors hover:border-[#D9A441]/40"
              >
                <h3 className="font-fraunces text-lg text-[#F3EEE2]">{c.name}</h3>
                <p className="mt-2 font-manrope text-sm text-[#9C93A8]">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FITUR / ALUR KOMUNITAS */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-fraunces text-2xl text-[#F3EEE2]">Di dalam setiap komunitas</h2>
          <p className="mt-2 max-w-lg font-manrope text-sm text-[#9C93A8]">
            Empat ruang yang selalu ada di setiap komunitas Sonaria.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, accent, title, desc }) => (
              <div key={title} className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
                <Icon size={22} style={{ color: accent }} />
                <h3 className="mt-4 font-fraunces text-lg text-[#F3EEE2]">{title}</h3>
                <p className="mt-2 font-manrope text-sm text-[#9C93A8]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA PENUTUP */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl rounded-2xl border border-[#2A2333] bg-gradient-to-br from-[#1E1826] to-[#191220] px-8 py-12 text-center">
          <h2 className="font-fraunces text-3xl text-[#F3EEE2]">Birama pertamamu menanti.</h2>
          <p className="mx-auto mt-3 max-w-md font-manrope text-sm text-[#9C93A8]">
            Daftar sekarang, pilih instrumen, dan gabung dengan komunitas yang tepat untukmu.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-full bg-[#D9A441] px-7 py-3 font-manrope text-sm text-[#14101B] transition-opacity hover:opacity-90"
          >
            Daftar Gratis
          </Link>
        </div>
      </section>
    </GuestLayout>
  );
}

// Halaman ini sudah membungkus dirinya sendiri dengan GuestLayout (tanpa
// Sidebar). Baris di bawah ini WAJIB ada supaya default persistent layout
// di app.tsx (yang membungkus semua halaman dengan AppLayout/Sidebar)
// tidak ikut menimpa Landing page — itu sebabnya Sidebar sempat muncul
// dobel dengan header GuestLayout.
Landing.layout = (page: React.ReactNode) => page;

export default Landing;