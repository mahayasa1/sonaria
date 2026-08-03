import React from 'react';
import type { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '@/components/Sidebar';

interface AppLayoutProps {
  title?: string;
  role?: string;
  communityRole?: string | null;
  communityName?: string | null;
  children: ReactNode;
}

/**
 * Layout dashboard untuk user yang sudah login (Member, Ketua, Wakil Ketua,
 * Staff, Admin). Sidebar menyesuaikan berdasarkan role & communityRole.
 */
export default function AppLayout({
  title,
  role = 'Member',
  communityRole = null,
  communityName = null,
  children,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#14101B] text-[#F3EEE2]">
      <Head title={title} />
      <Sidebar role={role} communityRole={communityRole} communityName={communityName} />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-8">{children}</div>
      </div>
    </div>
  );
}
