import React from 'react';
import type { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';

interface AppLayoutProps {
  title?: string;
  role?: string;
  communityRole?: string | null;
  communityName?: string | null;
  hideSidebar?: boolean;
  children: ReactNode;
}

/**
 * Layout dashboard untuk user yang sudah login (Member, Ketua, Wakil Ketua,
 * Staff, Admin). Sidebar menyesuaikan berdasarkan role & communityRole.
 * Set `hideSidebar` untuk halaman seperti onboarding yang tetap pakai
 * layout (background, Head, container) tapi tanpa sidebar.
 */
export default function AppLayout({
  title,
  role = 'Member',
  communityRole = null,
  communityName = null,
  hideSidebar = false,
  children,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#14101B] text-[#F3EEE2]">
      <Head title={title} />
      {!hideSidebar && (
        <Sidebar role={role} communityRole={communityRole} communityName={communityName} />
      )}
      <div className="flex-1 overflow-y-auto">
        <div className={`mx-auto px-8 py-8 ${hideSidebar ? 'max-w-3xl' : 'max-w-5xl'}`}>
          <div className="mb-4 flex justify-end">
            <NotificationBell />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}