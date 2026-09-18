import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import ManagerPanel from '@/components/ManagerPanel';
import BadgeAchievementShowcase from '@/components/BadgeAchievementShowcase';
import { Headset } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import CommunityStatusAlert from '@/components/CommunityStatusAlert';
import { QuestScreen, PixelPanel } from '@/components/quest/quest-ui';

/**
 * Dashboard Staff Komunitas — peran bantuan moderasi: menyetujui member
 * baru & mereview submission, TANPA kewenangan membuat Main Quest / Daily
 * Mission / Challenge (itu tetap kewenangan Ketua & Wakil Ketua).
 *
 * Catatan: role "Staff" belum ada di seed community_roles bawaan — tambahkan
 * baris baru di tabel community_roles ("Staff") lalu perluas CommunityPolicy
 * agar backend juga mengizinkan role ini melakukan moderasi.
 */
export default function CommunityStaff({
  community = { communities_id: 1, community_name: 'Komunitas Gitar Nusantara' },
  joinRequests = [{ community_join_requests_id: 4, user: { name: 'Yoga' } }],
  pendingSubmissions = [
    { id: 4, title: 'Video Practice: Fingerstyle Dasar', user: { name: 'Sinta' }, type: 'Practice', reviewUrl: '#' },
  ],
  badges = [],
  achievements = [],
}) {
  return (
    <AppLayout
      title="Dashboard Staff"
      role="Member"
      communityRole="Staff"
      communityName={community.community_name}
      communityId={community.communities_id}
    >
      <QuestScreen>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <header className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#93C5FD]"
              style={{ backgroundColor: 'rgba(147,197,253,0.15)' }}
            >
              <Headset size={20} />
            </div>
            <div>
              <p className="text-[10px] font-[var(--font-pixel)] tracking-[0.2em] text-[#93C5FD] uppercase">
                Staff Guild
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
                Kamu membantu menjaga guild tetap rapi: menyetujui anggota baru dan
                mereview submission latihan. Pembuatan quest, misi, dan challenge tetap
                ditangani Ketua &amp; Wakil Ketua.
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
              canCreateContent={false}
              canModerate
            />
          </div>
        </div>
      </QuestScreen>
    </AppLayout>
  );
}