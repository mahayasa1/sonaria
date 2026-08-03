import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import RoleBadge from '@/components/RoleBadge';
import { Headset } from 'lucide-react';

/**
 * Layout untuk Staff Komunitas — peran bantuan moderasi (approve member +
 * review submission) TANPA menu "Buat Konten Baru" di sidebar, karena
 * AppLayout hanya menampilkan section itu untuk communityRole Ketua/Wakil
 * Ketua (lihat Components/Sidebar.jsx).
 */
export default function CommunityStaffLayout({ title, communityName, children }) {
  return (
    <AppLayout title={title} role="Member" communityRole="Staff" communityName={communityName}>
      <div className="mb-6 flex justify-end">
        <RoleBadge icon={Headset} label="Staff Komunitas" accent="#9C93A8" />
      </div>
      {children}
    </AppLayout>
  );
}
