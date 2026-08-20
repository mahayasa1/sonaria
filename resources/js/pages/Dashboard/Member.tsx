import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import StaffProgress from '@/components/StaffProgress';
import EmptyState from '@/components/EmptyState';
import { Swords, Flame, Trophy, MessageSquare, ChevronRight, Compass } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import CommunityStatusAlert from '@/components/CommunityStatusAlert';

interface MemberProps {
  user: {
    name: string;
    total_xp: number;
  };
  level?: {
    level: number;
    title: string;
    min_xp: number;
    max_xp: number;
  } | null;
  community?: {
    community_name: string;
    communities_id: number | string;
  } | null;
  mainQuests?: Array<{ is_completed: boolean }>;
  dailyMissions?: Array<{
    daily_missions_id: number | string;
    my_progress?: { is_completed: boolean } | null;
  }>;
  challenge?: {
    xp_reward: number;
    title: string;
    end_date: string;
  } | null;
  recentPosts?: Array<{
    forum_posts_id: number | string;
    title: string;
    user: { name: string };
  }>;
}

/**
 * Dashboard untuk role Member biasa di dalam sebuah komunitas.
 * Props contoh (dikirim dari MainQuestController/DailyMissionController dst
 * via Inertia::render):
 *  user, community, level, mainQuests, dailyMissions, challenge, recentPosts
 */
export default function Member({
  user,
  level,
  community,
  mainQuests = [],
  dailyMissions = [],
  challenge = null,
  recentPosts = [],
}: MemberProps) {
  // level bisa null kalau data level user belum di-load / belum di-seed —
  // jaga-jaga supaya halaman tidak crash, walau seharusnya selalu dikirim
  // dari DashboardController::renderMember.
  const xpIntoLevel = level ? user.total_xp - level.min_xp : 0;
  const xpNeeded = level ? level.max_xp - level.min_xp : 0;
  const percentage = xpNeeded > 0 ? Math.round((xpIntoLevel / xpNeeded) * 100) : 0;
  const totalQuests = mainQuests.length;
  const completedQuests = mainQuests.filter((q) => q.is_completed).length;
  const totalMissions = dailyMissions.length;
  const completedMissions = dailyMissions.filter((m) => m.my_progress?.is_completed).length;

  // Belum gabung komunitas manapun (lihat DashboardController::index) — tampilkan
  // ajakan mencari komunitas alih-alih Main Quest/Daily Mission/Challenge palsu.
  if (!community) {
    return (
      <AppLayout title="Dashboard" role="Member" >
        <header>
          <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
            Selamat berlatih,
          </p>
          <h1 className="font-fraunces text-3xl text-[#F3EEE2]">{user.name}</h1>
          <div className="fixed top-6 right-8 z-50">
            <NotificationBell />
          </div>
        </header>
        <CommunityStatusAlert />

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
    <AppLayout title="Dashboard" role="Member" communityName={community.community_name} communityId={Number(community.communities_id)}>
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
              {level ? `Level ${level.level} — ${level.title}` : 'Level belum tersedia'}
            </h2>
          </div>
          <span className="font-mono text-sm text-[#D9A441]">{user.total_xp} XP</span>
        </div>
        {level && (
          <div className="mt-5">
            <StaffProgress
              percentage={percentage}
              label={`Menuju Level ${level.level + 1}`}
              value={`${xpIntoLevel} / ${xpNeeded} XP`}
              accent="brass"
            />
          </div>
        )}
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
            {completedQuests} / {totalQuests} birama selesai
          </p>
          <div className="mt-4">
            <StaffProgress percentage={totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0} accent="brass" />
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
            {completedMissions} / {totalMissions} misi hari ini
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
            {challenge && (
              <span className="font-mono text-xs text-[#D9A441]">+{challenge.xp_reward} XP</span>
            )}
          </div>
          {challenge ? (
            <>
              <p className="mt-3 font-fraunces text-xl text-[#F3EEE2]">{challenge.title}</p>
              <p className="mt-1 font-manrope text-xs text-[#75708A]">
                Berakhir {new Date(challenge.end_date).toLocaleDateString('id-ID')}
              </p>
            </>
          ) : (
            <p className="mt-3 font-manrope text-sm text-[#75708A]">
              Belum ada Challenge aktif di komunitas ini saat ini.
            </p>
          )}
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
          {recentPosts.length === 0 ? (
            <p className="font-manrope text-sm text-[#75708A]">Belum ada diskusi di forum komunitas ini.</p>
          ) : (
            recentPosts.map((p) => (
              <Link
                key={p.forum_posts_id}
                href={`/forum/${p.forum_posts_id}`}
                className="block rounded-lg bg-white/5 px-4 py-3 hover:bg-white/10"
              >
                <p className="font-manrope text-sm text-[#F3EEE2]">{p.title}</p>
                <p className="mt-0.5 font-manrope text-xs text-[#75708A]">oleh {p.user.name}</p>
              </Link>
            ))
          )}
        </div>
      </section>
    </AppLayout>
  );
}