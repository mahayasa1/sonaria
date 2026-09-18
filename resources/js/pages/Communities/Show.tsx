import React from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Users, Music2, Swords, Flame, Trophy, Calendar, Crown, ArrowLeft } from 'lucide-react';
import { QuestScreen, PixelPanel, PixelButton, QuestTag } from '@/components/quest/quest-ui';

interface MainQuest {
  main_quests_id: number;
  level: number;
  title: string;
}

interface DailyMission {
  daily_missions_id: number;
  title: string;
}

interface Challenge {
  challenges_id: number;
  title: string;
  xp_reward: number;
}

interface Community {
  communities_id: number;
  community_name: string;
  description?: string;
  total_member: number;
  created_at: string;
  category?: { name: string };
  owner?: { name: string };
  main_quests: MainQuest[];
  daily_missions: DailyMission[];
  challenges: Challenge[];
}

export default function Show({
  community,
  membershipStatus,
  membershipRole,
}: {
  community: Community;
  membershipStatus: 'Active' | 'Pending' | null;
  membershipRole?: string | null;
}) {
  const join = () => {
    router.post(`/communities/${community.communities_id}/join`, {}, { preserveScroll: true });
  };

  const leave = () => {
    if (!confirm('Yakin ingin keluar dari komunitas ini?')) return;
    router.post(`/communities/${community.communities_id}/leave`, {}, { preserveScroll: true });
  };

  return (
    <AppLayout title={community.community_name} role="Member" hideSidebar>
      <QuestScreen>
        <div className="mx-auto max-w-6xl px-6 py-10">
          {/* Tombol kembali */}
          <Link
            href="/communities"
            className="inline-flex items-center gap-1.5 font-[var(--font-pixel-mono)] text-xs text-[#93C5FD] transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            Kembali ke Cari Guild
          </Link>

          {/* Banner + info dasar */}
          <div className="mt-4 h-32 rounded-t-sm bg-gradient-to-br from-[#1E3A8A]/60 via-[#312E81]/50 to-[#0B1120]" />
          <PixelPanel className="-mt-1" borderColor="rgba(255,255,255,0.12)">
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#38BDF8]">
                  <Music2 size={14} />
                  <span className="text-[10px] font-[var(--font-pixel)] uppercase tracking-[0.14em]">
                    {community.category?.name ?? 'Umum'}
                  </span>
                </div>
                <h1 className="mt-2 text-2xl font-[var(--font-pixel)] text-white sm:text-3xl">
                  {community.community_name}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 font-[var(--font-pixel-mono)] text-xs text-[#CBD5F5]">
                  <Users size={13} /> {community.total_member} anggota
                </p>
              </div>

              {membershipStatus === 'Active' ? (
                <div className="flex flex-col items-stretch gap-2 sm:items-end">
                  <PixelButton as="a" href="/dashboard" variant="outline">
                    Kamu sudah bergabung — buka Dashboard
                  </PixelButton>
                  {membershipRole === 'Ketua' ? (
                    <p className="max-w-xs text-right font-[var(--font-pixel-mono)] text-[10px] text-[#93C5FD]/60">
                      Sebagai Ketua, transfer kepemimpinan dulu di halaman Kelola Member sebelum bisa keluar.
                    </p>
                  ) : (
                    <PixelButton onClick={leave} variant="danger">
                      Keluar Guild
                    </PixelButton>
                  )}
                </div>
              ) : membershipStatus === 'Pending' ? (
                <span
                  className="px-6 py-3 text-center text-sm font-[var(--font-pixel)] text-[#FBBF24]"
                  style={{
                    clipPath:
                      'polygon(0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), 0 calc(100% - 6px))',
                    border: '2px solid rgba(251,191,36,0.4)',
                    backgroundColor: 'rgba(251,191,36,0.1)',
                  }}
                >
                  Menunggu persetujuan bergabung
                </span>
              ) : (
                <PixelButton onClick={join} variant="solid">
                  Gabung Guild
                </PixelButton>
              )}
            </div>
          </PixelPanel>

          {/* About */}
          <div className="mt-6">
            <PixelPanel>
              <div className="p-6">
                <h2 className="text-[10px] font-[var(--font-pixel)] uppercase tracking-[0.2em] text-[#93C5FD]">
                  Tentang Guild
                </h2>
                <p className="mt-3 font-[var(--font-pixel-mono)] text-sm leading-relaxed text-[#C7D2FE]">
                  {community.description || 'Belum ada deskripsi dari pengelola komunitas.'}
                </p>
                <div className="mt-5 flex flex-wrap gap-6 font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/70">
                  <span className="flex items-center gap-1.5">
                    <Crown size={13} /> Dikelola oleh {community.owner?.name ?? '-'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    Dibuat {new Date(community.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            </PixelPanel>
          </div>

          {/* Preview modul gamifikasi — quest board */}
          <section className="mt-5 grid gap-5 md:grid-cols-3">
            <PixelPanel>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <QuestTag color="#38BDF8">Main Quest</QuestTag>
                  <Swords size={18} className="text-[#38BDF8]" />
                </div>
                <p className="mt-4 text-xl font-[var(--font-pixel)] text-white">
                  {community.main_quests.length} / 7 birama
                </p>
              </div>
            </PixelPanel>

            <PixelPanel>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <QuestTag color="#F87171">Daily Mission</QuestTag>
                  <Flame size={18} className="text-[#F87171]" />
                </div>
                <p className="mt-4 text-xl font-[var(--font-pixel)] text-white">
                  {community.daily_missions.length} misi aktif
                </p>
              </div>
            </PixelPanel>

            <PixelPanel>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <QuestTag color="#FBBF24">Challenge</QuestTag>
                  <Trophy size={18} className="text-[#FBBF24]" />
                </div>
                <p className="mt-4 text-base font-[var(--font-pixel)] leading-snug text-white">
                  {community.challenges[0]?.title ?? 'Belum ada challenge aktif'}
                </p>
              </div>
            </PixelPanel>
          </section>
        </div>
      </QuestScreen>
    </AppLayout>
  );
}