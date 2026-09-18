import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import ManagerPanel from '@/components/ManagerPanel';
import BadgeAchievementShowcase from '@/components/BadgeAchievementShowcase';
import { Crown } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import CommunityStatusAlert from '@/components/CommunityStatusAlert';
import { QuestScreen, PixelPanel, PixelProgress } from '@/components/quest/quest-ui';

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
  badges = [],
  achievements = [],
}) {
  return (
    <AppLayout
      title="Dashboard Ketua"
      role="Member"
      communityRole="Ketua"
      communityName={community.community_name}
      communityId={community.communities_id}
    >
      
        <div className="mx-auto max-w-6xl px-6 py-10">
          <header className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#FBBF24]"
              style={{ backgroundColor: 'rgba(251,191,36,0.15)' }}
            >
              <Crown size={20} />
            </div>
            <div>
              <p className="text-[10px] font-[var(--font-pixel)] tracking-[0.2em] text-[#93C5FD] uppercase">
                Ketua Guild
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

          <section className="mt-6">
            <PixelPanel>
              <div className="p-6">
                <span className="text-[10px] font-[var(--font-pixel)] uppercase tracking-[0.2em] text-[#93C5FD]">
                  Total anggota
                </span>
                <p className="mt-1 text-2xl font-[var(--font-pixel)] text-white">
                  {community.total_member} orang
                </p>
                <div className="mt-5">
                  <PixelProgress
                    percentage={72}
                    label="Kapasitas guild"
                    value="128 / 180"
                    color="#4ADE80"
                    colorTo="#38BDF8"
                  />
                </div>
              </div>
            </PixelPanel>
          </section>

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
    </AppLayout>
  );
}