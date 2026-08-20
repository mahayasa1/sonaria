import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
  Music2,
  LayoutGrid,
  Swords,
  Flame,
  Trophy,
  MessageSquare,
  BarChart3,
  Users,
  ShieldCheck,
  UserCog,
  Award,
  BadgeCheck,
  Settings,
  LogOut,
  Loader2,
  DoorOpen,
  UserCircle,
  Menu,
  X,
  PanelLeft,
} from 'lucide-react';


interface SidebarProps {
  role?: string;
  communityRole?: string | null;
  communityName?: string | null;
  communityId?: number | null;
}

interface ActiveCommunityShared {
  communities_id: number;
  community_name: string;
  role: string | null;
}

const COLLAPSE_STORAGE_KEY = 'sonaria:sidebar-collapsed';

/**
 * Navigasi role-aware. `role` = role global (Admin/Member), `communityRole`
 * = role di dalam komunitas aktif (Ketua/Wakil Ketua/Staff/null).
 *
 * Responsive:
 *  - Layar < lg: off-canvas drawer, dibuka lewat tombol hamburger, ada
 *    overlay, auto-close saat pindah halaman.
 *  - Layar >= lg: sidebar statis, bisa di-collapse jadi rail icon-only
 *    lewat tombol toggle (ikon tetap, tidak berputar/berganti arah).
 *    Status collapse disimpan di localStorage.
 */
export default function Sidebar({ role = 'Member', communityRole = null, communityName }: SidebarProps) {
  const { url, props } = usePage<{ activeCommunity: ActiveCommunityShared | null }>();
  const activeCommunity = props.activeCommunity ?? null;

  const effectiveCommunityName = communityName ?? activeCommunity?.community_name ?? null;
  const effectiveCommunityRole = communityRole ?? activeCommunity?.role ?? null;
  const effectiveCommunityId = activeCommunity?.communities_id ?? null;

  const [leaving, setLeaving] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Muat status collapse dari localStorage sekali di awal (desktop only).
  useEffect(() => {
    const saved = localStorage.getItem(COLLAPSE_STORAGE_KEY);
    if (saved === '1') setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? '1' : '0');
      return next;
    });
  };

  // Tutup drawer mobile otomatis tiap kali URL berubah.
  useEffect(() => {
    setMobileOpen(false);
  }, [url]);

  // Kunci scroll body saat drawer mobile terbuka.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (href: string) => url.startsWith(href);

  const leaveCommunity = () => {
    if (!effectiveCommunityId || leaving) return;
    if (!confirm('Yakin ingin keluar dari komunitas ini?')) return;

    setLeaving(true);
    router.post(
      `/communities/${effectiveCommunityId}/leave`,
      {},
      {
        preserveScroll: true,
        onFinish: () => setLeaving(false),
      },
    );
  };

  const itemClass = (href: string) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
      collapsed ? 'lg:justify-center lg:px-2' : ''
    } ${
      isActive(href)
        ? 'bg-[#D9A441]/12 text-[#D9A441]'
        : 'text-[#B7AFC2] hover:bg-white/5 hover:text-[#F3EEE2]'
    }`;

  // Label teks di samping ikon: selalu tampil di drawer mobile, tapi
  // disembunyikan di rail collapse desktop.
  const NavLabel = ({ children }: { children: React.ReactNode }) => (
    <span className={`whitespace-nowrap ${collapsed ? 'lg:hidden' : ''}`}>{children}</span>
  );

  const memberNav = (
    <>
      <Link href="/dashboard" className={itemClass('/dashboard')} title="Ringkasan">
        <LayoutGrid size={18} className="shrink-0" /> <NavLabel>Ringkasan</NavLabel>
      </Link>
      <Link href="/main-quests" className={itemClass('/main-quests')} title="Main Quest">
        <Swords size={18} className="shrink-0" /> <NavLabel>Main Quest</NavLabel>
      </Link>
      <Link href="/daily-missions" className={itemClass('/daily-missions')} title="Daily Mission">
        <Flame size={18} className="shrink-0" /> <NavLabel>Daily Mission</NavLabel>
      </Link>
      <Link href="/challenge" className={itemClass('/challenge')} title="Challenge">
        <Trophy size={18} className="shrink-0" /> <NavLabel>Challenge</NavLabel>
      </Link>
      <Link href="/forum" className={itemClass('/forum')} title="Forum">
        <MessageSquare size={18} className="shrink-0" /> <NavLabel>Forum</NavLabel>
      </Link>
      <Link href="/leaderboard" className={itemClass('/leaderboard')} title="Leaderboard">
        <BarChart3 size={18} className="shrink-0" /> <NavLabel>Leaderboard</NavLabel>
      </Link>
    </>
  );

  const accountNav = (
    <Link href="/settings/profile" className={itemClass('/settings')} title="Pengaturan Akun">
      <UserCircle size={18} className="shrink-0" /> <NavLabel>Pengaturan Akun</NavLabel>
    </Link>
  );

  const managerNav = (
    <>
      <div
        className={`mt-5 mb-2 px-3 font-manrope text-[11px] uppercase tracking-[0.14em] text-[#75708A] ${
          collapsed ? 'lg:hidden' : ''
        }`}
      >
        Kelola Komunitas
      </div>
      <Link href="/manage/members" className={itemClass('/manage/members')} title="Anggota & Join Request">
        <Users size={18} className="shrink-0" /> <NavLabel>Anggota &amp; Join Request</NavLabel>
      </Link>
      {(communityRole === 'Ketua' || communityRole === 'Wakil Ketua') && (
        <>
          <Link href="/manage/main-quests/create" className={itemClass('/manage/main-quests')} title="Buat Main Quest">
            <Swords size={18} className="shrink-0" /> <NavLabel>Buat Main Quest</NavLabel>
          </Link>
          <Link href="/manage/daily-missions" className={itemClass('/manage/daily-missions')} title="Kelola Daily Mission">
            <Flame size={18} className="shrink-0" /> <NavLabel>Kelola Daily Mission</NavLabel>
          </Link>
          <Link href="/manage/challenges" className={itemClass('/manage/challenges')} title="Kelola Challenge">
            <Trophy size={18} className="shrink-0" /> <NavLabel>Kelola Challenge</NavLabel>
          </Link>
        </>
      )}
      <Link href="/manage/reviews" className={itemClass('/manage/reviews')} title="Review Submission">
        <ShieldCheck size={18} className="shrink-0" /> <NavLabel>Review Submission</NavLabel>
      </Link>
    </>
  );

  const adminNav = (
    <>
      <Link href="/dashboard" className={itemClass('/dashboard')} title="Ringkasan">
        <LayoutGrid size={18} className="shrink-0" /> <NavLabel>Ringkasan</NavLabel>
      </Link>
      <Link href="/admin/users" className={itemClass('/admin/users')} title="Pengguna">
        <UserCog size={18} className="shrink-0" /> <NavLabel>Pengguna</NavLabel>
      </Link>
      <Link href="/admin/communities" className={itemClass('/admin/communities')} title="Komunitas">
        <Users size={18} className="shrink-0" /> <NavLabel>Komunitas</NavLabel>
      </Link>
      <Link href="/admin/categories" className={itemClass('/admin/categories')} title="Kategori Alat Musik">
        <Music2 size={18} className="shrink-0" /> <NavLabel>Kategori Alat Musik</NavLabel>
      </Link>
      <Link href="/admin/achievements" className={itemClass('/admin/achievements')} title="Achievement">
        <Award size={18} className="shrink-0" /> <NavLabel>Achievement</NavLabel>
      </Link>
      <Link href="/admin/badges" className={itemClass('/admin/badges')} title="Badge">
        <BadgeCheck size={18} className="shrink-0" /> <NavLabel>Badge</NavLabel>
      </Link>
      <Link href="/admin/settings" className={itemClass('/admin/settings')} title="Pengaturan">
        <Settings size={18} className="shrink-0" /> <NavLabel>Pengaturan</NavLabel>
      </Link>
    </>
  );

  const sidebarContent = (
    <>
      <div
        className={`mb-6 flex px-2 ${
          collapsed
            ? 'lg:flex-col lg:items-center lg:gap-2'
            : 'items-center justify-between'
        }`}
      >
        {/* Logo lengkap */}
        <Link
          href="/"
          className={`flex items-center gap-2 ${collapsed ? 'lg:hidden' : ''}`}
        >
          <Music2 size={22} className="shrink-0 text-[#D9A441]" />
          <span className="font-fraunces text-lg text-[#F3EEE2]">
            Sonaria
          </span>
        </Link>
      
        {/* Logo mini saat collapsed */}
        <Link
          href="/"
          className={`hidden ${collapsed ? 'lg:flex' : ''}`}
        >
          <Music2 size={22} className="text-[#D9A441]" />
        </Link>
      
        {/* Tombol tutup drawer mobile */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="rounded-lg p-1.5 text-[#B7AFC2] hover:bg-white/5 hover:text-[#F3EEE2] lg:hidden"
          aria-label="Tutup menu"
        >
          <X size={20} />
        </button>
      
        {/* Tombol collapse/expand desktop */}
        <button
          type="button"
          onClick={toggleCollapsed}
          className={`hidden rounded-lg p-1.5 text-[#B7AFC2] hover:bg-white/5 hover:text-[#F3EEE2] lg:flex ${
            collapsed ? 'order-first' : 'ml-auto'
          }`}
          aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
        >
          <PanelLeft size={18} />
        </button>
      </div>

      {effectiveCommunityName && role !== 'Admin' && (
        <div className={`mb-4 rounded-lg bg-white/5 px-3 py-2 ${collapsed ? 'lg:hidden' : ''}`}>
          <div className="font-manrope text-[10px] uppercase tracking-[0.14em] text-[#75708A]">
            Komunitas aktif
          </div>
          <div className="truncate text-sm text-[#F3EEE2]">{effectiveCommunityName}</div>
          {effectiveCommunityRole && (
            <div className="mt-0.5 text-xs text-[#D9A441]">{effectiveCommunityRole}</div>
          )}
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden">
        {role === 'Admin' ? adminNav : memberNav}
        {role !== 'Admin' && effectiveCommunityRole && managerNav}
      </nav>

      <div className="mt-4 space-y-1 border-t border-[#2A2333] pt-3">
        {accountNav}
        {effectiveCommunityId && role !== 'Admin' && (
          <button
            type="button"
            onClick={leaveCommunity}
            disabled={leaving}
            title="Keluar Komunitas"
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#B7AFC2] transition-colors hover:bg-[#C1443C]/10 hover:text-[#C1443C] disabled:opacity-50 ${
              collapsed ? 'lg:justify-center lg:px-2' : ''
            }`}
          >
            {leaving ? (
              <Loader2 size={18} className="shrink-0 animate-spin" />
            ) : (
              <DoorOpen size={18} className="shrink-0" />
            )}
            <NavLabel>Keluar Komunitas</NavLabel>
          </button>
        )}

        <Link
          href="/logout"
          method="post"
          as="button"
          title="Keluar Akun"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#B7AFC2] hover:bg-white/5 hover:text-[#C1443C] ${
            collapsed ? 'lg:justify-center lg:px-2' : ''
          }`}
        >
          <LogOut size={18} className="shrink-0" /> <NavLabel>Keluar Akun</NavLabel>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Tombol hamburger, hanya tampil di mobile/tablet */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-30 flex items-center justify-center rounded-lg border border-[#2A2333] bg-[#191220] p-2 text-[#F3EEE2] lg:hidden"
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </button>

      {/* Overlay gelap saat drawer mobile terbuka */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: drawer off-canvas di mobile, rail collapsible di desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r border-[#2A2333] bg-[#191220] px-3 py-5 transition-all duration-200 ease-out lg:static lg:z-auto lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-18 lg:px-2' : 'lg:w-64'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}