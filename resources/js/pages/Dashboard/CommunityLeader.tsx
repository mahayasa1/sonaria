import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import StaffProgress from '@/Components/StaffProgress';
import ManagerPanel from '@/Components/ManagerPanel';
import { Crown } from 'lucide-react';

/**
 * Dashboard Ketua Komunitas — kewenangan penuh: membuat Main Quest, Daily
 * Mission, Challenge, plus moderasi (approve member & review submission).
 */
export default function CommunityLeader({
  user = { name: 'Salsa' },
  community = { communities_id: 1, community_name: 'Komunitas Gitar Nusantara', total_member: 128 },
  joinRequests = [
    { community_join_requests_id: 1, user: { name: 'Dimas' } },
    { community_join_requests_id: 2, user: { name: 'Wulan' } },
  ],
  pendingSubmissions = [
    { id: 1, title: 'Video Practice: Etude I', user: { name: 'Rafi' }, type: 'Practice', reviewUrl: '#' },
    { id: 2, title: 'Video Challenge: Cover Lagu Daerah', user: { name: 'Nadia' }, type: 'Challenge', reviewUrl: '#' },
  ],
}) {
  return (
    <AppLayout
      title="Dashboard Ketua"
      role="Member"
      communityRole="Ketua"
      communityName={community.community_name}
    >
      <header className="flex items-center gap-3">
        <div className="rounded-full bg-[#D9A441]/15 p-2.5 text-[#D9A441]">
          <Crown size={20} />
        </div>
        <div>
          <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
            Ketua Komunitas
          </p>
          <h1 className="font-fraunces text-2xl text-[#F3EEE2]">{community.community_name}</h1>
        </div>
      </header>

      <section className="mt-6 rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
        <span className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
          Total anggota
        </span>
        <p className="mt-1 font-fraunces text-2xl text-[#F3EEE2]">{community.total_member} orang</p>
        <div className="mt-4">
          <StaffProgress percentage={72} label="Kapasitas komunitas" value="128 / 180" accent="reed" />
        </div>
      </section>

      <ManagerPanel
        communityId={community.communities_id}
        joinRequests={joinRequests}
        pendingSubmissions={pendingSubmissions}
        canCreateContent
        canModerate
      />
    </AppLayout>
  );
}
