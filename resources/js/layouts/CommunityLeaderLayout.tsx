import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import RoleBadge from '@/components/RoleBadge';
import { Crown } from 'lucide-react';

/**
 * Layout untuk Ketua Komunitas — kewenangan penuh (buat konten + moderasi).
 * Sidebar otomatis menampilkan section "Kelola Komunitas" lengkap lewat
 * AppLayout(communityRole="Ketua").
 */
export default function CommunityLeaderLayout({ title, communityName, children }) {
  return (
    <AppLayout title={title} role="Member" communityRole="Ketua" communityName={communityName}>
      <div className="mb-6 flex justify-end">
        <RoleBadge icon={Crown} label="Ketua Komunitas" accent="#D9A441" />
      </div>
      {children}
    </AppLayout>
  );
}
