import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import StaffProgress from '@/components/StaffProgress';
import EmptyState from '@/components/EmptyState';
import { Swords, Flame, Trophy, MessageSquare, ChevronRight, Compass } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

/**
 * Dashboard untuk role Member biasa di dalam sebuah komunitas.
 * Props contoh (dikirim dari MainQuestController/DailyMissionController dst
 * via Inertia::render):
 *  user, community, level, mainQuests, dailyMissions, challenge, recentPosts
 */
export default function Member({
  user = { name: 'Aditya', total_xp: 1240, username: 'aditya_gitar' },
  level = { level: 4, min_xp: 1000, max_xp: 2000, title: 'Penabuh Ritme' },
  community = { community_name: 'Komunitas Gitar Nusantara' },
  mainQuests = [
    { main_quests_id: 1, level: 1, title: 'Dasar Fingering', is_completed: true },
    { main_quests_id: 2, level: 2, title: 'Tangga Nada Mayor', is_completed: true },
    { main_quests_id: 3, level: 3, title: 'Chord Barre', is_completed: true },
    { main_quests_id: 4, level: 4, title: 'Fingerstyle Dasar', is_completed: false },
    { main_quests_id: 5, level: 5, title: 'Improvisasi Blues', is_completed: false },
    { main_quests_id: 6, level: 6, title: 'Teknik Tapping', is_completed: false },
    { main_quests_id: 7, level: 7, title: 'Ujian Repertoar', is_completed: false },
  ],
  dailyMissions = Array.from({ length: 6 }).map((_, i) => ({
    daily_missions_id: i + 1,
    title: `Kuis Harian ${i + 1}`,
    my_progress: { is_completed: i < 3 },
  })),
  challenge = { title: 'Cover Lagu Daerah Favoritmu', xp_reward: 500, end_date: '2026-08-05' },
  recentPosts = [
    { forum_posts_id: 1, title: 'Tips menjaga tempo saat fingerstyle?', user: { name: 'Rani' } },
    { forum_posts_id: 2, title: 'Rekomendasi senar untuk pemula', user: { name: 'Bima' } },
  ],
}) {
  const xpIntoLevel = user.total_xp - level.min_xp;
  const xpNeeded = level.max_xp - level.min_xp;
  const percentage = Math.round((xpIntoLevel / xpNeeded) * 100);
  const completedQuests = mainQuests.filter((q) => q.is_completed).length;
  const completedMissions = dailyMissions.filter((m) => m.my_progress?.is_completed).length;

  // Belum gabung komunitas manapun (lihat DashboardController::index) — tampilkan
  // ajakan mencari komunitas alih-alih Main Quest/Daily Mission/Challenge palsu.
  if (!community) {
    return (
      <AppLayout title="Dashboard" role="Member">
        <header>
          <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
            Selamat berlatih,
          </p>
          <h1 className="font-fraunces text-3xl text-[#F3EEE2]">{user.name}</h1>
          <div className="fixed top-6 right-8 z-50">
            <NotificationBell />
          </div>
        </header>

        <div className="mt-6">
          <EmptyState
            icon={Compass}
            title="Kamu belum tergabung di komunitas manapun"
            description="Cari komunitas sesuai instrumenmu untuk mulai mengerjakan Main Quest, Daily Mission, dan Challenge."
            action={
              <Link
                href="/communities"
                className="rounded-full bg-[#D9A441] px-5 py-2.5 font-manrope text-sm text-[#14101B] transition-opacity hover:opacity-90"
              >
                Cari Komunitas
              </Link>
            }
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard" role="Member" communityName={community.community_name}>
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
          Selamat berlatih,
        </p>
        <h1 className="font-fraunces text-3xl text-[#F3EEE2]">{user.name}</h1>
        <div className="fixed top-6 right-8 z-50">
            <NotificationBell />
          </div>
      </header>

      {/* Kartu level */}
      <section className="mt-6 rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
              Level saat ini
            </span>
            <h2 className="font-fraunces text-2xl text-[#F3EEE2]">
              Level {level.level} — {level.title}
            </h2>
          </div>
          <span className="font-mono text-sm text-[#D9A441]">{user.total_xp} XP</span>
        </div>
        <div className="mt-5">
          <StaffProgress
            percentage={percentage}
            label={`Menuju Level ${level.level + 1}`}
            value={`${xpIntoLevel} / ${xpNeeded} XP`}
            accent="brass"
          />
        </div>
      </section>

      {/* Grid modul komunitas */}
      <section className="mt-6 grid gap-5 md:grid-cols-2">
        {/* Main Quest */}
        <Link
          href="/main-quests"
          className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-6 transition-colors hover:border-[#D9A441]/40"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#D9A441]">
              <Swords size={18} />
              <span className="font-manrope text-sm">Main Quest</span>
            </div>
            <ChevronRight size={16} className="text-[#75708A]" />
          </div>
          <p className="mt-3 font-fraunces text-xl text-[#F3EEE2]">
            {completedQuests} / 7 birama selesai
          </p>
          <div className="mt-4">
            <StaffProgress percentage={(completedQuests / 7) * 100} accent="brass" />
          </div>
        </Link>

        {/* Daily Mission */}
        <Link
          href="/daily-missions"
          className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-6 transition-colors hover:border-[#C1443C]/40"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#C1443C]">
              <Flame size={18} />
              <span className="font-manrope text-sm">Daily Mission</span>
            </div>
            <ChevronRight size={16} className="text-[#75708A]" />
          </div>
          <p className="mt-3 font-fraunces text-xl text-[#F3EEE2]">
            {completedMissions} / 6 misi hari ini
          </p>
          <div className="mt-4 flex gap-1.5">
            {dailyMissions.map((m) => (
              <span
                key={m.daily_missions_id}
                className="h-1.5 flex-1 rounded-full"
                style={{ backgroundColor: m.my_progress?.is_completed ? '#C1443C' : '#332B40' }}
              />
            ))}
          </div>
        </Link>

        {/* Challenge */}
        <Link
          href="/challenge"
          className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-6 transition-colors hover:border-[#D9A441]/40 md:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#D9A441]">
              <Trophy size={18} />
              <span className="font-manrope text-sm">Challenge Aktif</span>
            </div>
            <span className="font-mono text-xs text-[#D9A441]">+{challenge.xp_reward} XP</span>
          </div>
          <p className="mt-3 font-fraunces text-xl text-[#F3EEE2]">{challenge.title}</p>
          <p className="mt-1 font-manrope text-xs text-[#75708A]">
            Berakhir {new Date(challenge.end_date).toLocaleDateString('id-ID')}
          </p>
        </Link>
      </section>

      {/* Forum ringkas */}
      <section className="mt-6 rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#4C8C86]">
            <MessageSquare size={18} />
            <span className="font-manrope text-sm">Diskusi Terbaru</span>
          </div>
          <Link href="/forum" className="font-manrope text-xs text-[#75708A] hover:text-[#F3EEE2]">
            Lihat semua →
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {recentPosts.map((p) => (
            <Link
              key={p.forum_posts_id}
              href={`/forum/${p.forum_posts_id}`}
              className="block rounded-lg bg-white/5 px-4 py-3 hover:bg-white/10"
            >
              <p className="font-manrope text-sm text-[#F3EEE2]">{p.title}</p>
              <p className="mt-0.5 font-manrope text-xs text-[#75708A]">oleh {p.user.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
