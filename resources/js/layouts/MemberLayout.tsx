import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import RoleBadge from '@/components/RoleBadge';
import { User } from 'lucide-react';

/**
 * Layout untuk role User/Member biasa di dalam sebuah komunitas.
 */
export default function MemberLayout({ title, communityName, children }: { title?: string; communityName: string; children: React.ReactNode }) {
  return (
    <AppLayout title={title ?? undefined} role="Member" communityRole={null} communityName={communityName ?? undefined}>
      <div className="mb-6 flex justify-end">
        <RoleBadge icon={User} label="Member" accent="#4C8C86" />
      </div>
      {children}
    </AppLayout>
  );
}
