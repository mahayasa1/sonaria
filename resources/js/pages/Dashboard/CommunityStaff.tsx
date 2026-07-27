import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import ManagerPanel from '@/Components/ManagerPanel';
import { Headset } from 'lucide-react';

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
}) {
  return (
    <AppLayout
      title="Dashboard Staff"
      role="Member"
      communityRole="Staff"
      communityName={community.community_name}
    >
      <header className="flex items-center gap-3">
        <div className="rounded-full bg-[#9C93A8]/15 p-2.5 text-[#9C93A8]">
          <Headset size={20} />
        </div>
        <div>
          <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
            Staff Komunitas
          </p>
          <h1 className="font-fraunces text-2xl text-[#F3EEE2]">{community.community_name}</h1>
        </div>
      </header>

      <p className="mt-4 max-w-lg font-manrope text-sm text-[#9C93A8]">
        Kamu membantu menjaga komunitas tetap rapi: menyetujui anggota baru dan
        mereview submission latihan. Pembuatan quest, misi, dan challenge tetap
        ditangani Ketua &amp; Wakil Ketua.
      </p>

      <ManagerPanel
        communityId={community.communities_id}
        joinRequests={joinRequests}
        pendingSubmissions={pendingSubmissions}
        canCreateContent={false}
        canModerate
      />
    </AppLayout>
  );
}
