import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Users, Layers, Music2, ShieldAlert } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import { QuestScreen, PixelPanel, CornerBrackets } from '@/components/quest/quest-ui';

/**
 * Dashboard Admin — mengelola sistem secara keseluruhan: pengguna, semua
 * komunitas, dan master data (roles, levels, kategori, badge, achievement).
 */
export default function Admin({
  stats = {
    total_users: 4820,
    total_communities: 63,
    total_active_challenges: 41,
    reported_content: 3,
  },
  recentCommunities = [
    { communities_id: 1, community_name: 'Komunitas Gitar Nusantara', category: 'String', total_member: 128 },
    { communities_id: 2, community_name: 'Perkusi Nusantara', category: 'Percussion', total_member: 76 },
    { communities_id: 3, community_name: 'Tiup Harmoni', category: 'Woodwind', total_member: 54 },
  ],
}) {
  const cards = [
    { label: 'Total Pengguna', value: stats.total_users, icon: Users, accent: '#38BDF8' },
    { label: 'Total Komunitas', value: stats.total_communities, icon: Layers, accent: '#818CF8' },
    { label: 'Challenge Aktif', value: stats.total_active_challenges, icon: Music2, accent: '#FBBF24' },
    { label: 'Konten Dilaporkan', value: stats.reported_content, icon: ShieldAlert, accent: '#F87171' },
  ];

  return (
    <AppLayout title="Dashboard Admin" role="Admin">
      <QuestScreen>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <header>
            <p className="text-[10px] font-[var(--font-pixel)] tracking-[0.25em] text-[#93C5FD] uppercase">
              Panel Administrasi
            </p>
            <h1 className="mt-2 text-2xl font-[var(--font-pixel)] text-white sm:text-3xl">
              Ringkasan Platform
            </h1>
            <div className="fixed top-6 right-8 z-50">
              <NotificationBell />
            </div>
          </header>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ label, value, icon: Icon, accent }) => (
              <PixelPanel key={label}>
                <div className="p-5">
                  <Icon size={18} style={{ color: accent }} />
                  <p className="mt-3 font-[var(--font-pixel)] text-2xl text-white">
                    {value.toLocaleString('id-ID')}
                  </p>
                  <p className="mt-1 font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/70">
                    {label}
                  </p>
                </div>
              </PixelPanel>
            ))}
          </section>

          <section className="mt-6">
            <PixelPanel>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[10px] font-[var(--font-pixel)] uppercase tracking-[0.2em] text-[#93C5FD]">
                    Guild Terbaru
                  </h2>
                  <Link
                    href="/admin/communities"
                    className="font-[var(--font-pixel-mono)] text-xs text-[#93C5FD] hover:text-white"
                  >
                    Lihat semua →
                  </Link>
                </div>

                <div className="mt-4 space-y-2">
                  {recentCommunities.map((c) => (
                    <Link
                      key={c.communities_id}
                      href={`/admin/communities/${c.communities_id}`}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-[#38BDF8]/30 hover:bg-white/[0.06]"
                    >
                      <div>
                        <p className="font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2]">
                          {c.community_name}
                        </p>
                        <p className="font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/60">
                          {c.category}
                        </p>
                      </div>
                      <span className="font-[var(--font-pixel-mono)] text-xs text-[#38BDF8]">
                        {c.total_member} anggota
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </PixelPanel>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="group relative">
              <CornerBrackets />
              <Link href="/admin/settings" className="block">
                <PixelPanel className="transition-colors duration-300 group-hover:bg-white/[0.03]">
                  <div className="p-6">
                    <h3 className="text-lg font-[var(--font-pixel)] text-white">Master Data</h3>
                    <p className="mt-2 font-[var(--font-pixel-mono)] text-sm text-[#93C5FD]/70">
                      Kelola Roles, Levels, Kategori Alat Musik, Badge, dan Achievement.
                    </p>
                  </div>
                </PixelPanel>
              </Link>
            </div>
            <div className="group relative">
              <CornerBrackets />
              <Link href="/admin/users" className="block">
                <PixelPanel className="transition-colors duration-300 group-hover:bg-white/[0.03]">
                  <div className="p-6">
                    <h3 className="text-lg font-[var(--font-pixel)] text-white">Pengguna</h3>
                    <p className="mt-2 font-[var(--font-pixel-mono)] text-sm text-[#93C5FD]/70">
                      Cari, aktifkan/nonaktifkan, atau blokir akun pengguna.
                    </p>
                  </div>
                </PixelPanel>
              </Link>
            </div>
          </section>
        </div>
      </QuestScreen>
    </AppLayout>
  );
}