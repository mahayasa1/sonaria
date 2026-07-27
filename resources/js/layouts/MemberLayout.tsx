import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import RoleBadge from '@/Components/RoleBadge';
import { User } from 'lucide-react';

/**
 * Layout untuk role User/Member biasa di dalam sebuah komunitas.
 */
export default function MemberLayout({ title, communityName, children }) {
  return (
    <AppLayout title={title} role="Member" communityRole={null} communityName={communityName}>
      <div className="mb-6 flex justify-end">
        <RoleBadge icon={User} label="Member" accent="#4C8C86" />
      </div>
      {children}
    </AppLayout>
  );
}
