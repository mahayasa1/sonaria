import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import ManagerPanel from '@/components/ManagerPanel';
import BadgeAchievementShowcase from '@/components/BadgeAchievementShowcase';
import { ShieldHalf } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import CommunityStatusAlert from '@/components/CommunityStatusAlert';
import { QuestScreen, PixelPanel } from '@/components/quest/quest-ui';

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
  badges = [],
  achievements = [],
}) {
  return (
    <AppLayout
      title="Dashboard Wakil Ketua"
      role="Member"
      communityRole="Wakil Ketua"
      communityName={community.community_name}
      communityId={community.communities_id}
    >
      <QuestScreen>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <header className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#4ADE80]"
              style={{ backgroundColor: 'rgba(74,222,128,0.15)' }}
            >
              <ShieldHalf size={20} />
            </div>
            <div>
              <p className="text-[10px] font-[var(--font-pixel)] tracking-[0.2em] text-[#93C5FD] uppercase">
                Wakil Ketua Guild
              </p>
              <h1 className="mt-1 text-xl font-[var(--font-pixel)] text-white sm:text-2xl">
                {community.community_name}
              </h1>
            </div>
            <div className="fixed top-6 right-8 z-50">
              <NotificationBell />
            </div>
          </header>
          <div className="mt-4">
            <CommunityStatusAlert />
          </div>

          <div className="mt-6">
            <PixelPanel>
              <p className="max-w-lg p-5 font-[var(--font-pixel-mono)] text-sm leading-relaxed text-[#C7D2FE]">
                Kamu mendampingi Ketua mengelola konten dan menjaga aktivitas harian guild
                tetap berjalan lancar.
              </p>
            </PixelPanel>
          </div>

          {/* Badge & Achievement */}
          <div className="mt-6">
            <BadgeAchievementShowcase badges={badges} achievements={achievements} />
          </div>

          <div className="mt-6">
            <ManagerPanel
              communityId={community.communities_id}
              joinRequests={joinRequests}
              pendingSubmissions={pendingSubmissions}
              canCreateContent
              canModerate
            />
          </div>
        </div>
      </QuestScreen>
    </AppLayout>
  );
}