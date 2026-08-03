import type { ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';
import RoleBadge from '@/components/RoleBadge';
import { ShieldHalf } from 'lucide-react';

type ViceLeaderLayoutProps = {
  title?: string | null;
  communityName?: string | null;
  children: ReactNode;
};

/**
 * Layout untuk Wakil Ketua Komunitas — kewenangan setara Ketua (mendampingi
 * mengelola konten & moderasi harian).
 */
export default function ViceLeaderLayout({ title, communityName, children }: ViceLeaderLayoutProps) {
  return (
    <AppLayout title={title ?? undefined} role="Member" communityRole="Wakil Ketua" communityName={communityName ?? undefined}>
      <div className="mb-6 flex justify-end">
        <RoleBadge icon={ShieldHalf} label="Wakil Ketua" accent="#4C8C86" />
      </div>
      {children}
    </AppLayout>
  );
}
