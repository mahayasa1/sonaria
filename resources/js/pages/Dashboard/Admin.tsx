import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Users, Layers, Music2, ShieldAlert } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

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
    { label: 'Total Pengguna', value: stats.total_users, icon: Users, accent: '#4C8C86' },
    { label: 'Total Komunitas', value: stats.total_communities, icon: Layers, accent: '#D9A441' },
    { label: 'Challenge Aktif', value: stats.total_active_challenges, icon: Music2, accent: '#D9A441' },
    { label: 'Konten Dilaporkan', value: stats.reported_content, icon: ShieldAlert, accent: '#C1443C' },
  ];

  return (
    <AppLayout title="Dashboard Admin" role="Admin">
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
          Panel Administrasi
        </p>
        <h1 className="font-fraunces text-3xl text-[#F3EEE2]">Ringkasan Platform</h1>
 <div className="fixed top-6 right-8 z-50">
        <NotificationBell />
      </div>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-5">
            <Icon size={18} style={{ color: accent }} />
            <p className="mt-3 font-mono text-2xl text-[#F3EEE2]">{value.toLocaleString('id-ID')}</p>
            <p className="mt-1 font-manrope text-xs text-[#75708A]">{label}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
            Komunitas Terbaru
          </h2>
          <Link href="/admin/communities" className="font-manrope text-xs text-[#75708A] hover:text-[#F3EEE2]">
            Lihat semua →
          </Link>
        </div>

        <div className="mt-4 space-y-2">
          {recentCommunities.map((c) => (
            <Link
              key={c.communities_id}
              href={`/admin/communities/${c.communities_id}`}
              className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 hover:bg-white/10"
            >
              <div>
                <p className="font-manrope text-sm text-[#F3EEE2]">{c.community_name}</p>
                <p className="font-manrope text-xs text-[#75708A]">{c.category}</p>
              </div>
              <span className="font-mono text-xs text-[#D9A441]">{c.total_member} anggota</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/settings"
          className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-6 hover:border-[#D9A441]/40"
        >
          <h3 className="font-fraunces text-lg text-[#F3EEE2]">Master Data</h3>
          <p className="mt-2 font-manrope text-sm text-[#9C93A8]">
            Kelola Roles, Levels, Kategori Alat Musik, Badge, dan Achievement.
          </p>
        </Link>
        <Link
          href="/admin/users"
          className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-6 hover:border-[#D9A441]/40"
        >
          <h3 className="font-fraunces text-lg text-[#F3EEE2]">Pengguna</h3>
          <p className="mt-2 font-manrope text-sm text-[#9C93A8]">
            Cari, aktifkan/nonaktifkan, atau blokir akun pengguna.
          </p>
        </Link>
      </section>
    </AppLayout>
  );
}
