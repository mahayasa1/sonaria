import React from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Users, Music2, Swords, Flame, Trophy, Calendar, Crown } from 'lucide-react';

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
}: {
  community: Community;
  membershipStatus: 'Active' | 'Pending' | null;
}) {
  const join = () => {
    router.post(`/communities/${community.communities_id}/join`, {}, { preserveScroll: true });
  };

  return (
    <AppLayout title={community.community_name} role="Member" hideSidebar>
      {/* Banner + info dasar */}
      <div className="h-32 rounded-xl bg-gradient-to-br from-[#332B40] to-[#1E1826]" />
      <div className="-mt-10 flex flex-col gap-4 px-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#D9A441]">
            <Music2 size={14} />
            <span className="font-manrope text-[11px] uppercase tracking-[0.14em]">
              {community.category?.name ?? 'Umum'}
            </span>
          </div>
          <h1 className="mt-1 font-fraunces text-3xl text-[#F3EEE2]">{community.community_name}</h1>
          <p className="mt-1 flex items-center gap-1.5 font-manrope text-xs text-[#B7AFC2]">
            <Users size={13} /> {community.total_member} anggota
          </p>
        </div>

        {membershipStatus === 'Active' ? (
          <a
            href="/dashboard"
            className="rounded-full border border-[#4C8C86]/40 bg-[#4C8C86]/12 px-6 py-3 text-center font-manrope text-sm text-[#4C8C86]"
          >
            Kamu sudah bergabung — buka Dashboard
          </a>
        ) : membershipStatus === 'Pending' ? (
          <span className="rounded-full border border-[#D9A441]/40 bg-[#D9A441]/12 px-6 py-3 text-center font-manrope text-sm text-[#D9A441]">
            Menunggu persetujuan bergabung
          </span>
        ) : (
          <button
            onClick={join}
            className="rounded-full bg-[#D9A441] px-6 py-3 font-manrope text-sm text-[#14101B] transition-opacity hover:opacity-90"
          >
            Gabung Komunitas
          </button>
        )}
      </div>

      {/* About */}
      <section className="mt-8 rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
        <h2 className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
          Tentang Komunitas
        </h2>
        <p className="mt-2 font-manrope text-sm text-[#B7AFC2]">
          {community.description || 'Belum ada deskripsi dari pengelola komunitas.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-6 font-manrope text-xs text-[#75708A]">
          <span className="flex items-center gap-1.5">
            <Crown size={13} /> Dikelola oleh {community.owner?.name ?? '-'}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            Dibuat {new Date(community.created_at).toLocaleDateString('id-ID')}
          </span>
        </div>
      </section>

      {/* Preview modul gamifikasi */}
      <section className="mt-5 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-5">
          <div className="flex items-center gap-2 text-[#D9A441]">
            <Swords size={16} />
            <span className="font-manrope text-sm">Main Quest</span>
          </div>
          <p className="mt-2 font-fraunces text-xl text-[#F3EEE2]">
            {community.main_quests.length} / 7 birama
          </p>
        </div>
        <div className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-5">
          <div className="flex items-center gap-2 text-[#C1443C]">
            <Flame size={16} />
            <span className="font-manrope text-sm">Daily Mission</span>
          </div>
          <p className="mt-2 font-fraunces text-xl text-[#F3EEE2]">
            {community.daily_missions.length} misi aktif
          </p>
        </div>
        <div className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-5">
          <div className="flex items-center gap-2 text-[#D9A441]">
            <Trophy size={16} />
            <span className="font-manrope text-sm">Challenge</span>
          </div>
          <p className="mt-2 font-fraunces text-xl text-[#F3EEE2]">
            {community.challenges[0]?.title ?? 'Belum ada challenge aktif'}
          </p>
        </div>
      </section>
    </AppLayout>
  );
}
