import React from 'react';
import { Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import {
  Swords,
  Flame,
  Trophy,
  MessageSquare,
  Music2,
  ChevronRight,
  Check,
  Play,
  Lock,
  Users,
  Sparkles,
} from 'lucide-react';
import OnboardingGradientBackground from '@/components/onboarding/gradient-background';
import { getCategoryIcon } from '@/components/onboarding/instrument-icons';

/** Potongan sudut "patah" ala 8-bit untuk panel/tombol */
const PIXEL_CLIP =
  'polygon(0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), 0 calc(100% - 6px))';

/** Panel dengan "border" pixel 2 lapis (bukan CSS border biasa, karena border
 *  biasa nggak ikut kepotong rapi sama clip-path patah di atas) */
function PixelPanel({
  children,
  className = '',
  borderColor = 'rgba(255,255,255,0.18)',
  bg = 'rgba(6,10,25,0.55)',
}: {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  bg?: string;
}) {
  return (
    <div
      className={className}
      style={{ clipPath: PIXEL_CLIP, backgroundColor: borderColor, padding: 2 }}
    >
      <div className="h-full w-full" style={{ clipPath: PIXEL_CLIP, backgroundColor: bg }}>
        {children}
      </div>
    </div>
  );
}

/** Bracket sudut ala "cursor seleksi" di menu game, muncul saat hover */
function CornerBrackets({ color = '#38BDF8' }: { color?: string }) {
  const base =
    'pointer-events-none absolute h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100';
  return (
    <>
      <span className={`${base} -left-1 -top-1 border-l-2 border-t-2`} style={{ borderColor: color }} />
      <span className={`${base} -right-1 -top-1 border-r-2 border-t-2`} style={{ borderColor: color }} />
      <span className={`${base} -left-1 -bottom-1 border-b-2 border-l-2`} style={{ borderColor: color }} />
      <span className={`${base} -right-1 -bottom-1 border-b-2 border-r-2`} style={{ borderColor: color }} />
    </>
  );
}

const STATS = [
  { icon: Users, label: 'Pemain aktif', value: '12.000+' },
  { icon: Trophy, label: 'Komunitas', value: '80+' },
  { icon: Sparkles, label: 'Quest selesai', value: '45.000+' },
];

const CATEGORIES = [
  { name: 'Percussion', desc: 'Drum, kendang, marimba.' },
  { name: 'Woodwind', desc: 'Seruling, klarinet, saksofon.' },
  { name: 'Brass', desc: 'Trompet, trombon, French horn.' },
  { name: 'String', desc: 'Gitar, biola, cello.' },
];

const QUEST_MAP: { label: string; status: 'done' | 'current' | 'locked' }[] = [
  { label: 'Materi Dasar', status: 'done' },
  { label: 'Quiz Nada', status: 'done' },
  { label: 'Video Etude I', status: 'done' },
  { label: 'Materi Ritme', status: 'current' },
  { label: 'Quiz Interval', status: 'locked' },
  { label: 'Video Etude II', status: 'locked' },
  { label: 'Ujian Akhir', status: 'locked' },
];

const FEATURES = [
  {
    icon: Swords,
    accent: '#38BDF8',
    tag: 'MAIN QUEST',
    reward: '+120 XP',
    title: '7 Birama Pembelajaran',
    desc: 'Level berjenjang: materi, quiz, lalu unggah video latihanmu. Reward XP naik setiap birama yang kamu tamatkan.',
  },
  {
    icon: Flame,
    accent: '#F87171',
    tag: 'DAILY QUEST',
    reward: '+40 XP/hari',
    title: 'Misi Harian',
    desc: 'Enam kuis ringan dari komunitasmu. Cepat dikerjakan, XP kejutan menanti di setiap penyelesaian.',
  },
  {
    icon: Trophy,
    accent: '#FBBF24',
    tag: 'EVENT QUEST',
    reward: '+500 XP',
    title: 'Challenge Komunitas',
    desc: 'Satu misi video unjuk kemampuan yang sedang berlangsung, dengan reward XP terbesar di komunitas.',
  },
  {
    icon: MessageSquare,
    accent: '#4ADE80',
    tag: 'GUILD HALL',
    reward: 'Sosial',
    title: 'Forum Diskusi',
    desc: 'Tempat bertukar teknik, bertanya, dan merayakan progres bersama sesama anggota komunitas.',
  },
];

const nodeStyles: Record<
  'done' | 'current' | 'locked',
  { ring: string; bg: string; text: string; icon: React.ReactNode }
> = {
  done: {
    ring: 'border-[#4ADE80]',
    bg: 'bg-[#4ADE80]/15',
    text: 'text-[#4ADE80]',
    icon: <Check size={16} />,
  },
  current: {
    ring: 'border-[#38BDF8]',
    bg: 'bg-gradient-to-br from-[#38BDF8] to-[#818CF8]',
    text: 'text-[#0B1120]',
    icon: <Play size={16} />,
  },
  locked: {
    ring: 'border-white/15',
    bg: 'bg-white/[0.03]',
    text: 'text-white/30',
    icon: <Lock size={14} />,
  },
};

function Landing() {
  return (
    <GuestLayout title="Sonaria — Komunitas Belajar Musik">
      <div className="relative min-h-screen overflow-x-hidden text-[#F3EEE2]">
        <OnboardingGradientBackground />

        {/* tekstur scanline tipis biar berasa layar game retro */}
        <div
          className="pointer-events-none fixed inset-0 z-20 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)',
          }}
          aria-hidden
        />

        <div className="relative z-10">
          {/* HERO — layar "start" */}
          <section className="relative overflow-hidden px-6 pt-16 pb-20">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-12 md:grid-cols-2 md:items-center">
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full">
                    <img src="/images/logo.png" alt="Sonaria"/>
                  </div>
                  <h1 className="mt-4 text-3xl leading-relaxed font-[var(--font-pixel)] text-white [text-shadow:0_0_18px_rgba(147,197,253,0.35)] sm:text-4xl">
                    Naik level
                    <br />
                    setiap kali
                    <br />
                    <span className="text-[#38BDF8]">kau berlatih.</span>
                  </h1>
                  <p className="mt-6 max-w-md text-base leading-relaxed font-[var(--font-pixel-mono)] text-[#C7D2FE]">
                    Sonaria mengubah proses belajar alat musik jadi RPG
                    berjenjang: pilih kelas instrumenmu, gabung guild
                    komunitas, dan kumpulkan XP dari materi, quiz, sampai
                    video latihan yang dinilai langsung oleh sesama pemain.
                  </p>

                  <div className="mt-8 flex flex-col items-center gap-3 md:items-start">
                    <Link
                      href="/register"
                      className="group relative flex items-center gap-2 px-7 py-3 text-xs font-[var(--font-pixel)] text-[#0B1120] transition-transform hover:-translate-y-0.5"
                      style={{
                        clipPath: PIXEL_CLIP,
                        background: 'linear-gradient(90deg,#38BDF8,#818CF8)',
                        boxShadow: '0 0 25px rgba(56,189,248,0.4)',
                      }}
                    >
                      Mulai Quest
                      <ChevronRight size={14} />
                    </Link>
                    <span className="text-[10px] font-[var(--font-pixel-mono)] text-[#93C5FD]/70 animate-pulse">
                      &gt; tekan untuk memulai permainan
                    </span>
                    <Link
                      href="/login"
                      className="mt-1 text-sm font-[var(--font-pixel-mono)] text-[#93C5FD] hover:text-white"
                    >
                      Sudah punya save file? Lanjutkan →
                    </Link>
                  </div>

                  {/* stat chips ala HUD */}
                  <div className="mt-9 flex flex-wrap justify-center gap-3 md:justify-start">
                    {STATS.map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5"
                      >
                        <Icon size={14} className="text-[#38BDF8]" />
                        <span className="text-xs font-[var(--font-pixel)] text-white">
                          {value}
                        </span>
                        <span className="text-[10px] font-[var(--font-pixel-mono)] text-[#93C5FD]/70">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kartu progres = "character sheet" */}
                <PixelPanel className="mx-auto w-full max-w-sm">
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[9px] font-[var(--font-pixel)] tracking-[0.2em] text-[#93C5FD] uppercase">
                        Character sheet
                      </span>
                      <span className="text-[10px] font-[var(--font-pixel)] text-[#38BDF8]">
                        LV 4 / 7
                      </span>
                    </div>

                    {/* xp bar */}
                    <div className="mb-5 h-3 w-full overflow-hidden rounded-full border border-white/15 bg-white/[0.03]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#818CF8]"
                        style={{ width: '57%', boxShadow: '0 0 10px rgba(56,189,248,0.6)' }}
                      />
                    </div>

                    <div className="space-y-3">
                      {['Materi Fingering Dasar', 'Quiz Tangga Nada', 'Video Latihan Etude I'].map(
                        (t, idx) => (
                          <div
                            key={t}
                            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
                          >
                            <span
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                              style={{
                                backgroundColor: idx < 2 ? '#4ADE80' : '#38BDF8',
                                boxShadow: `0 0 8px ${idx < 2 ? '#4ADE80' : '#38BDF8'}`,
                              }}
                            >
                              <Check size={12} className="text-[#0B1120]" />
                            </span>
                            <span className="font-[var(--font-pixel-mono)] text-sm text-[#CBD5F5]">
                              {t}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </PixelPanel>
              </div>
            </div>
          </section>

          {/* CHARACTER SELECT — kategori alat musik */}
          <section className="border-y border-white/10 px-6 py-16">
            <div className="mx-auto max-w-6xl">
              <p className="text-[10px] font-[var(--font-pixel)] tracking-[0.25em] text-[#93C5FD] uppercase">
                Character select
              </p>
              <h2 className="mt-3 text-xl font-[var(--font-pixel)] text-white sm:text-2xl">
                Pilih kelasmu
              </h2>
              <p className="mt-3 max-w-lg font-[var(--font-pixel-mono)] text-sm text-[#93C5FD]">
                Setiap kelas instrumen punya jalur quest dan guild komunitasnya sendiri.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                {CATEGORIES.map((c) => {
                  const Icon = getCategoryIcon(c.name);
                  return (
                    <div key={c.name} className="group relative">
                      <CornerBrackets />
                      <PixelPanel className="h-full">
                        <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 px-4 py-8 text-center transition-colors duration-300 group-hover:bg-white/[0.03] sm:min-h-[250px]">
                          <span className="h-14 w-14 text-[#93C5FD] transition-colors group-hover:text-[#38BDF8] sm:h-16 sm:w-16">
                            <Icon />
                          </span>
                          <span className="text-sm font-[var(--font-pixel)] tracking-widest text-white/90 uppercase sm:text-base">
                            {c.name}
                          </span>
                          <span className="font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/80">
                            {c.desc}
                          </span>
                        </div>
                      </PixelPanel>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* PETA QUEST — 7 birama */}
          <section className="px-6 py-16">
            <div className="mx-auto max-w-6xl">
              <p className="text-[10px] font-[var(--font-pixel)] tracking-[0.25em] text-[#93C5FD] uppercase">
                Quest map
              </p>
              <h2 className="mt-3 text-xl font-[var(--font-pixel)] text-white sm:text-2xl">
                7 birama menuju naik level
              </h2>
              <p className="mt-3 max-w-lg font-[var(--font-pixel-mono)] text-sm text-[#93C5FD]">
                Setiap komunitas punya main quest berjenjang tujuh langkah. Selesaikan satu,
                buka jalan ke berikutnya.
              </p>

              <div className="relative mt-14">
                <div className="absolute left-0 right-0 top-7 hidden h-0 border-t-2 border-dashed border-white/15 sm:block" />
                <div className="flex gap-8 overflow-x-auto pb-4 sm:justify-between sm:gap-2">
                  {QUEST_MAP.map((q, i) => {
                    const s = nodeStyles[q.status];
                    return (
                      <div
                        key={q.label}
                        className={`relative z-10 flex w-24 shrink-0 flex-col items-center gap-2 text-center ${
                          i % 2 === 1 ? 'sm:translate-y-6' : ''
                        }`}
                      >
                        <div
                          className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 ${s.ring} ${s.bg} ${s.text}`}
                        >
                          {q.status === 'current' && (
                            <span className="absolute inset-0 animate-ping rounded-full border-2 border-[#38BDF8] opacity-40" />
                          )}
                          {s.icon}
                        </div>
                        <span className="text-[9px] font-[var(--font-pixel)] tracking-wide text-white/40">
                          B{i + 1}
                        </span>
                        <span className="font-[var(--font-pixel-mono)] text-[11px] leading-tight text-[#CBD5F5]">
                          {q.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* QUEST BOARD — fitur */}
          <section className="border-t border-white/10 px-6 py-16">
            <div className="mx-auto max-w-6xl">
              <p className="text-[10px] font-[var(--font-pixel)] tracking-[0.25em] text-[#93C5FD] uppercase">
                Quest board
              </p>
              <h2 className="mt-3 text-xl font-[var(--font-pixel)] text-white sm:text-2xl">
                Di dalam setiap guild
              </h2>
              <p className="mt-3 max-w-lg font-[var(--font-pixel-mono)] text-sm text-[#93C5FD]">
                Empat papan quest yang selalu ada di setiap komunitas Sonaria.
              </p>

              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {FEATURES.map(({ icon: Icon, accent, tag, reward, title, desc }) => (
                  <PixelPanel key={title}>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <span
                          className="rounded-full border px-2.5 py-1 text-[9px] font-[var(--font-pixel)] tracking-wider uppercase"
                          style={{ borderColor: `${accent}55`, color: accent }}
                        >
                          {tag}
                        </span>
                        <span className="text-[10px] font-[var(--font-pixel-mono)] text-[#FBBF24]">
                          {reward}
                        </span>
                      </div>
                      <Icon size={22} className="mt-4" style={{ color: accent }} />
                      <h3 className="mt-3 text-base font-[var(--font-pixel)] text-white">
                        {title}
                      </h3>
                      <p className="mt-2 font-[var(--font-pixel-mono)] text-sm leading-relaxed text-[#CBD5F5]">
                        {desc}
                      </p>
                    </div>
                  </PixelPanel>
                ))}
              </div>
            </div>
          </section>

          {/* CTA PENUTUP — "continue screen" */}
          <section className="px-6 pb-24">
            <div className="mx-auto max-w-6xl">
              <PixelPanel borderColor="rgba(56,189,248,0.45)" bg="rgba(11,17,32,0.85)">
                <div
                  className="px-8 py-14 text-center"
                  style={{ boxShadow: '0 0 60px rgba(56,189,248,0.12) inset' }}
                >
                  <p className="text-[10px] font-[var(--font-pixel)] tracking-[0.25em] text-[#93C5FD] uppercase">
                    New game
                  </p>
                  <h2 className="mt-3 text-2xl font-[var(--font-pixel)] text-white sm:text-3xl">
                    Birama pertamamu menanti.
                  </h2>
                  <p className="mx-auto mt-4 max-w-md font-[var(--font-pixel-mono)] text-sm text-[#C7D2FE]">
                    Buat karaktermu, pilih instrumen, dan gabung dengan guild yang tepat
                    untukmu.
                  </p>
                  <div className="mt-7 flex flex-col items-center gap-3">
                    <Link
                      href="/register"
                      className="flex items-center gap-2 px-7 py-3 text-xs font-[var(--font-pixel)] text-[#0B1120] transition-transform hover:-translate-y-0.5"
                      style={{
                        clipPath: PIXEL_CLIP,
                        background: 'linear-gradient(90deg,#38BDF8,#818CF8)',
                        boxShadow: '0 0 25px rgba(56,189,248,0.35)',
                      }}
                    >
                      Mulai Quest Baru
                      <ChevronRight size={14} />
                    </Link>
                    <Link
                      href="/login"
                      className="text-sm font-[var(--font-pixel-mono)] text-[#93C5FD] hover:text-white"
                    >
                      Lanjutkan save file →
                    </Link>
                  </div>
                </div>
              </PixelPanel>
            </div>
          </section>
        </div>
      </div>
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