import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import BadgeAchievementShowcase from '@/components/BadgeAchievementShowcase';
import { Swords, Flame, Trophy, MessageSquare, ChevronRight, Compass } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import CommunityStatusAlert from '@/components/CommunityStatusAlert';
import {
  QuestScreen,
  PixelPanel,
  CornerBrackets,
  PixelButton,
  PixelProgress,
  QuestTag,
} from '@/components/quest/quest-ui';

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
  badges?: Array<{
    badges_id: number;
    badge_name: string;
    description?: string;
    icon?: string;
  }>;
  achievements?: Array<{
    achievements_id: number;
    title: string;
    description?: string;
    icon?: string;
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
  badges = [],
  achievements = [],
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
      <AppLayout title="Dashboard" role="Member">
        <QuestScreen>
          <div className="mx-auto max-w-6xl px-6 py-10">
            <header>
              <p className="text-[10px] font-[var(--font-pixel)] tracking-[0.25em] text-[#93C5FD] uppercase">
                Selamat berlatih,
              </p>
              <h1 className="mt-2 text-2xl font-[var(--font-pixel)] text-white sm:text-3xl">
                {user.name}
              </h1>
              <div className="fixed top-6 right-8 z-50">
                <NotificationBell />
              </div>
            </header>
            <div className="mt-4">
              <CommunityStatusAlert />
            </div>

            <div className="mt-8">
              <PixelPanel>
                <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
                  <Compass size={30} className="text-[#93C5FD]/50" />
                  <p className="text-base font-[var(--font-pixel)] text-white">
                    Kamu belum tergabung di guild manapun
                  </p>
                  <p className="max-w-sm font-[var(--font-pixel-mono)] text-sm text-[#93C5FD]/70">
                    Cari komunitas sesuai instrumenmu untuk mulai mengerjakan Main Quest,
                    Daily Mission, dan Challenge.
                  </p>
                  <PixelButton as={Link} href="/communities" variant="solid">
                    Cari Guild
                  </PixelButton>
                </div>
              </PixelPanel>
            </div>
          </div>
        </QuestScreen>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Dashboard"
      role="Member"
      communityName={community.community_name}
      communityId={Number(community.communities_id)}
    >
      <QuestScreen>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <header>
            <p className="text-[10px] font-[var(--font-pixel)] tracking-[0.25em] text-[#93C5FD] uppercase">
              Selamat berlatih,
            </p>
            <h1 className="mt-2 text-2xl font-[var(--font-pixel)] text-white sm:text-3xl">
              {user.name}
            </h1>
            <div className="fixed top-6 right-8 z-50">
              <NotificationBell />
            </div>
          </header>

          {/* Kartu level = character sheet */}
          <section className="mt-6">
            <PixelPanel>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-[var(--font-pixel)] uppercase tracking-[0.2em] text-[#93C5FD]">
                      Level saat ini
                    </span>
                    <h2 className="mt-1 text-xl font-[var(--font-pixel)] text-white">
                      {level ? `Level ${level.level} — ${level.title}` : 'Level belum tersedia'}
                    </h2>
                  </div>
                  <span className="font-[var(--font-pixel-mono)] text-sm text-[#38BDF8]">
                    {user.total_xp} XP
                  </span>
                </div>
                {level && (
                  <div className="mt-5">
                    <PixelProgress
                      percentage={percentage}
                      label={`Menuju Level ${level.level + 1}`}
                      value={`${xpIntoLevel} / ${xpNeeded} XP`}
                    />
                  </div>
                )}
              </div>
            </PixelPanel>
          </section>

          {/* Badge & Achievement */}
          <div className="mt-6">
            <BadgeAchievementShowcase badges={badges} achievements={achievements} />
          </div>

          {/* Grid modul komunitas — quest board */}
          <section className="mt-6 grid gap-5 md:grid-cols-2">
            {/* Main Quest */}
            <div className="group relative">
              <CornerBrackets />
              <Link href="/main-quests" className="block">
                <PixelPanel className="transition-colors duration-300 group-hover:bg-white/[0.03]">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <QuestTag color="#38BDF8">Main Quest</QuestTag>
                      <div className="flex items-center gap-1 text-[#75708A]">
                        <Swords size={16} className="text-[#38BDF8]" />
                        <ChevronRight size={14} />
                      </div>
                    </div>
                    <p className="mt-4 text-xl font-[var(--font-pixel)] text-white">
                      {completedQuests} / {totalQuests} birama selesai
                    </p>
                    <div className="mt-4">
                      <PixelProgress
                        percentage={totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0}
                      />
                    </div>
                  </div>
                </PixelPanel>
              </Link>
            </div>

            {/* Daily Mission */}
            <div className="group relative">
              <CornerBrackets color="#F87171" />
              <Link href="/daily-missions" className="block">
                <PixelPanel className="transition-colors duration-300 group-hover:bg-white/[0.03]">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <QuestTag color="#F87171">Daily Mission</QuestTag>
                      <div className="flex items-center gap-1 text-[#75708A]">
                        <Flame size={16} className="text-[#F87171]" />
                        <ChevronRight size={14} />
                      </div>
                    </div>
                    <p className="mt-4 text-xl font-[var(--font-pixel)] text-white">
                      {completedMissions} / {totalMissions} misi hari ini
                    </p>
                    <div className="mt-4 flex gap-1.5">
                      {dailyMissions.map((m) => (
                        <span
                          key={m.daily_missions_id}
                          className="h-1.5 flex-1 rounded-full"
                          style={{
                            backgroundColor: m.my_progress?.is_completed
                              ? '#F87171'
                              : 'rgba(255,255,255,0.1)',
                            boxShadow: m.my_progress?.is_completed
                              ? '0 0 6px rgba(248,113,113,0.6)'
                              : 'none',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </PixelPanel>
              </Link>
            </div>

            {/* Challenge */}
            <div className="group relative md:col-span-2">
              <CornerBrackets color="#FBBF24" />
              <Link href="/challenge" className="block">
                <PixelPanel className="transition-colors duration-300 group-hover:bg-white/[0.03]">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <QuestTag color="#FBBF24">Challenge Aktif</QuestTag>
                      <div className="flex items-center gap-3">
                        {challenge && (
                          <span className="font-[var(--font-pixel-mono)] text-xs text-[#FBBF24]">
                            +{challenge.xp_reward} XP
                          </span>
                        )}
                        <Trophy size={16} className="text-[#FBBF24]" />
                      </div>
                    </div>
                    {challenge ? (
                      <>
                        <p className="mt-4 text-xl font-[var(--font-pixel)] text-white">
                          {challenge.title}
                        </p>
                        <p className="mt-1 font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/60">
                          Berakhir {new Date(challenge.end_date).toLocaleDateString('id-ID')}
                        </p>
                      </>
                    ) : (
                      <p className="mt-4 font-[var(--font-pixel-mono)] text-sm text-[#93C5FD]/60">
                        Belum ada Challenge aktif di komunitas ini saat ini.
                      </p>
                    )}
                  </div>
                </PixelPanel>
              </Link>
            </div>
          </section>

          {/* Forum ringkas */}
          <section className="mt-6">
            <PixelPanel>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#4ADE80]">
                    <MessageSquare size={18} />
                    <span className="text-[10px] font-[var(--font-pixel)] uppercase tracking-[0.2em]">
                      Diskusi Terbaru
                    </span>
                  </div>
                  <Link
                    href="/forum"
                    className="font-[var(--font-pixel-mono)] text-xs text-[#93C5FD] hover:text-white"
                  >
                    Lihat semua →
                  </Link>
                </div>
                <div className="mt-4 space-y-2">
                  {recentPosts.length === 0 ? (
                    <p className="font-[var(--font-pixel-mono)] text-sm text-[#93C5FD]/60">
                      Belum ada diskusi di forum komunitas ini.
                    </p>
                  ) : (
                    recentPosts.map((p) => (
                      <Link
                        key={p.forum_posts_id}
                        href={`/forum/${p.forum_posts_id}`}
                        className="block rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-[#4ADE80]/30 hover:bg-white/[0.06]"
                      >
                        <p className="font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2]">
                          {p.title}
                        </p>
                        <p className="mt-0.5 font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/60">
                          oleh {p.user.name}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </PixelPanel>
          </section>
        </div>
      </QuestScreen>
    </AppLayout>
  );
}