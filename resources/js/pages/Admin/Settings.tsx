import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings({ appName }: { appName: string }) {
  return (
    <AppLayout title="Pengaturan" role="Admin">
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">Admin</p>
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <SettingsIcon size={24} className="text-[#D9A441]" /> Pengaturan
        </h1>
      </header>

      <section className="mt-8 rounded-xl border border-dashed border-[#332B40] bg-[#1E1826]/50 p-8">
        <p className="font-manrope text-sm text-[#B7AFC2]">
          Aplikasi: <span className="text-[#F3EEE2]">{appName}</span>
        </p>
        <p className="mt-3 max-w-lg font-manrope text-sm text-[#75708A]">
          Manajemen Roles, Levels, Kategori Alat Musik, Badge, dan Achievement belum tersambung ke
          endpoint API (belum ada Api\Admin* controller untuk resource-resource ini). Halaman ini
          akan dilengkapi begitu endpoint-nya tersedia.
        </p>
      </section>
    </AppLayout>
  );
}
