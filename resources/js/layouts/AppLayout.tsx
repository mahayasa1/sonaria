import React from 'react';
import type { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '@/components/Sidebar';
import OnboardingGradientBackground from '@/components/onboarding/gradient-background';

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
    <div className="relative flex h-screen overflow-hidden bg-[#020617] text-[#F3EEE2]">
      <Head title={title} />

      {/* Gradient background, absolute supaya nggak nutupin Sidebar
          (bukan fixed — lihat penjelasan di bawah) */}
      <OnboardingGradientBackground />

      {!hideSidebar && (
        <div className="relative z-20">
          <Sidebar role={role} communityRole={communityRole} communityName={communityName} communityId={communityId} />
        </div>
      )}

      <div className="relative z-10 flex-1 overflow-y-auto">
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