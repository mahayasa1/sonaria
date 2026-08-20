import React from 'react';
import type { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '@/components/Sidebar';


interface AppLayoutProps {
  title?: string;
  role?: string;
  communityRole?: string | null;
  communityName?: string | null;
  communityId?: number | null;
  hideSidebar?: boolean;
  children: ReactNode;
}

export default function AppLayout({
  title,
  role = 'Member',
  communityRole = null,
  communityName = null,
  communityId = null,
  hideSidebar = false,
  children,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#14101B] text-[#F3EEE2]">
      <Head title={title} />
      {!hideSidebar && (
        <Sidebar role={role} communityRole={communityRole} communityName={communityName} communityId={communityId} />
      )}
      <div className="flex-1 overflow-y-auto">
        <div
          className={`mx-auto px-8 py-8 ${hideSidebar ? 'max-w-3xl' : 'max-w-5xl'} ${
            hideSidebar ? '' : 'pt-16 lg:pt-8'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}