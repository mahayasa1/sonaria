import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import ManagerPanel from '@/components/ManagerPanel';
import { ShieldHalf } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import CommunityStatusAlert from '@/components/CommunityStatusAlert';

/**
 * Dashboard Wakil Ketua Komunitas — kewenangan setara Ketua untuk membuat
 * konten & moderasi (mendampingi Ketua mengelola operasional harian).
*/
export default function ViceLeader({
  community = { communities_id: 1, community_name: 'Komunitas Gitar Nusantara' },
  joinRequests = [{ community_join_requests_id: 3, user: { name: 'Fajar' } }],
  pendingSubmissions = [
    { id: 3, title: 'Video Practice: Chord Barre', user: { name: 'Ica' }, type: 'Practice', reviewUrl: '#' },
  ],
}) {
  return (
    <AppLayout
      title="Dashboard Wakil Ketua"
      role="Member"
      communityRole="Wakil Ketua"
      communityName={community.community_name}
    >
      <header className="flex items-center gap-3">
        <div className="rounded-full bg-[#4C8C86]/15 p-2.5 text-[#4C8C86]">
          <ShieldHalf size={20} />
        </div>
        <div>
          <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
            Wakil Ketua Komunitas
          </p>
          <h1 className="font-fraunces text-2xl text-[#F3EEE2]">{community.community_name}</h1>
        </div>
        <div className="fixed top-6 right-8 z-50">
          <NotificationBell />
        </div>
      </header>
      <CommunityStatusAlert />

      <p className="mt-4 max-w-lg font-manrope text-sm text-[#9C93A8]">
        Kamu mendampingi Ketua mengelola konten dan menjaga aktivitas harian komunitas
        tetap berjalan lancar.
      </p>

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
