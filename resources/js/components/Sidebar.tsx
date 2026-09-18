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
import { QuestTag } from '@/components/quest/quest-ui';

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

/** Warna aksen chip role, biar kelihatan kayak "rank badge" di game */
const roleColor = (role: string | null) => {
  if (role === 'Ketua') return '#FBBF24';
  if (role === 'Wakil Ketua') return '#4ADE80';
  if (role === 'Staff') return '#93C5FD';
  return '#38BDF8';
};

/** Kotak ikon ala "slot" kemampuan di menu game — menyala saat item aktif */
function NavIcon({
  icon: Icon,
  active,
  danger = false,
  loading = false,
}: {
  icon: React.ElementType;
  active: boolean;
  danger?: boolean;
  loading?: boolean;
}) {
  const accent = danger ? '#F87171' : '#38BDF8';
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-200"
      style={{
        borderColor: active ? `${accent}80` : 'rgba(255,255,255,0.12)',
        backgroundColor: active ? `${accent}22` : 'rgba(255,255,255,0.03)',
        color: active ? accent : danger ? '#F87171' : '#93C5FD',
        boxShadow: active ? `0 0 10px ${accent}66` : 'none',
      }}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Icon size={15} />}
    </span>
  );
}

/** Garis penanda "kamu di sini" di kiri item aktif */
function ActiveBar({ color = '#38BDF8' }: { color?: string }) {
  return (
    <span
      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-sm"
      style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
    />
  );
}

/**
 * Navigasi role-aware. `role` = role global (Admin/Member), `communityRole`
 * = role di dalam komunitas aktif (Ketua/Wakil Ketua/Staff/null).
 *
 * Responsive:
 *  - Layar < lg: off-canvas drawer, dibuka lewat tombol hamburger, ada
 *    overlay, auto-close saat pindah halaman, body di-lock (anti scroll
 *    tembus ala iOS), bisa ditutup lewat tombol Escape.
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

  // Kunci scroll body saat drawer mobile terbuka. Dipakai teknik
  // position:fixed (bukan cuma overflow:hidden) supaya nggak "bocor"
  // rubber-band scroll di iOS Safari, lalu posisi scroll dipulihkan
  // persis saat drawer ditutup.
  useEffect(() => {
    if (!mobileOpen) return;

    const scrollY = window.scrollY;
    const { body } = document;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  // Tutup drawer mobile lewat tombol Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
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
    `group relative flex items-center gap-3 rounded-[4px] py-2 pr-3 transition-colors duration-200 ${
      collapsed ? 'lg:justify-center lg:px-0' : 'pl-2'
    } ${isActive(href) ? 'bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`;

  // Label teks di samping ikon: selalu tampil di drawer mobile, tapi
  // disembunyikan di rail collapse desktop.
  const NavLabel = ({ active, children }: { active: boolean; children: React.ReactNode }) => (
    <span
      className={`truncate font-[var(--font-pixel-mono)] text-[13px] ${collapsed ? 'lg:hidden' : ''}`}
      style={{ color: active ? '#F3EEE2' : 'rgba(147,197,253,0.75)' }}
    >
      {children}
    </span>
  );

  const memberNav = (
    <>
      <Link href="/dashboard" className={itemClass('/dashboard')} title="Ringkasan">
        {isActive('/dashboard') && <ActiveBar />}
        <NavIcon icon={LayoutGrid} active={isActive('/dashboard')} />
        <NavLabel active={isActive('/dashboard')}>Ringkasan</NavLabel>
      </Link>
      <Link href="/main-quests" className={itemClass('/main-quests')} title="Main Quest">
        {isActive('/main-quests') && <ActiveBar />}
        <NavIcon icon={Swords} active={isActive('/main-quests')} />
        <NavLabel active={isActive('/main-quests')}>Main Quest</NavLabel>
      </Link>
      <Link href="/daily-missions" className={itemClass('/daily-missions')} title="Daily Mission">
        {isActive('/daily-missions') && <ActiveBar />}
        <NavIcon icon={Flame} active={isActive('/daily-missions')} />
        <NavLabel active={isActive('/daily-missions')}>Daily Mission</NavLabel>
      </Link>
      <Link href="/challenge" className={itemClass('/challenge')} title="Challenge">
        {isActive('/challenge') && <ActiveBar />}
        <NavIcon icon={Trophy} active={isActive('/challenge')} />
        <NavLabel active={isActive('/challenge')}>Challenge</NavLabel>
      </Link>
      <Link href="/forum" className={itemClass('/forum')} title="Forum">
        {isActive('/forum') && <ActiveBar />}
        <NavIcon icon={MessageSquare} active={isActive('/forum')} />
        <NavLabel active={isActive('/forum')}>Forum</NavLabel>
      </Link>
      <Link href="/leaderboard" className={itemClass('/leaderboard')} title="Leaderboard">
        {isActive('/leaderboard') && <ActiveBar />}
        <NavIcon icon={BarChart3} active={isActive('/leaderboard')} />
        <NavLabel active={isActive('/leaderboard')}>Leaderboard</NavLabel>
      </Link>
    </>
  );

  const accountNav = (
    <Link href="/settings/profile" className={itemClass('/settings')} title="Pengaturan Akun">
      {isActive('/settings') && <ActiveBar />}
      <NavIcon icon={UserCircle} active={isActive('/settings')} />
      <NavLabel active={isActive('/settings')}>Pengaturan Akun</NavLabel>
    </Link>
  );

  const managerNav = (
    <>
      <div
        className={`mt-5 mb-2 flex items-center gap-2 px-2 ${collapsed ? 'lg:hidden' : ''}`}
      >
        <span className="h-px flex-1 bg-white/10" />
        <span className="font-[var(--font-pixel)] text-[9px] uppercase tracking-[0.2em] text-[#93C5FD]/70">
          Kelola Guild
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <Link href="/manage/members" className={itemClass('/manage/members')} title="Anggota & Join Request">
        {isActive('/manage/members') && <ActiveBar />}
        <NavIcon icon={Users} active={isActive('/manage/members')} />
        <NavLabel active={isActive('/manage/members')}>Anggota &amp; Join Request</NavLabel>
      </Link>
      {(communityRole === 'Ketua' || communityRole === 'Wakil Ketua') && (
        <>
          <Link href="/manage/main-quests/create" className={itemClass('/manage/main-quests')} title="Buat Main Quest">
            {isActive('/manage/main-quests') && <ActiveBar />}
            <NavIcon icon={Swords} active={isActive('/manage/main-quests')} />
            <NavLabel active={isActive('/manage/main-quests')}>Buat Main Quest</NavLabel>
          </Link>
          <Link href="/manage/daily-missions" className={itemClass('/manage/daily-missions')} title="Kelola Daily Mission">
            {isActive('/manage/daily-missions') && <ActiveBar />}
            <NavIcon icon={Flame} active={isActive('/manage/daily-missions')} />
            <NavLabel active={isActive('/manage/daily-missions')}>Kelola Daily Mission</NavLabel>
          </Link>
          <Link href="/manage/challenges" className={itemClass('/manage/challenges')} title="Kelola Challenge">
            {isActive('/manage/challenges') && <ActiveBar />}
            <NavIcon icon={Trophy} active={isActive('/manage/challenges')} />
            <NavLabel active={isActive('/manage/challenges')}>Kelola Challenge</NavLabel>
          </Link>
        </>
      )}
      <Link href="/manage/reviews" className={itemClass('/manage/reviews')} title="Review Submission">
        {isActive('/manage/reviews') && <ActiveBar />}
        <NavIcon icon={ShieldCheck} active={isActive('/manage/reviews')} />
        <NavLabel active={isActive('/manage/reviews')}>Review Submission</NavLabel>
      </Link>
    </>
  );

  const adminNav = (
    <>
      <Link href="/dashboard" className={itemClass('/dashboard')} title="Ringkasan">
        {isActive('/dashboard') && <ActiveBar />}
        <NavIcon icon={LayoutGrid} active={isActive('/dashboard')} />
        <NavLabel active={isActive('/dashboard')}>Ringkasan</NavLabel>
      </Link>
      <Link href="/admin/users" className={itemClass('/admin/users')} title="Pengguna">
        {isActive('/admin/users') && <ActiveBar />}
        <NavIcon icon={UserCog} active={isActive('/admin/users')} />
        <NavLabel active={isActive('/admin/users')}>Pengguna</NavLabel>
      </Link>
      <Link href="/admin/communities" className={itemClass('/admin/communities')} title="Komunitas">
        {isActive('/admin/communities') && <ActiveBar />}
        <NavIcon icon={Users} active={isActive('/admin/communities')} />
        <NavLabel active={isActive('/admin/communities')}>Komunitas</NavLabel>
      </Link>
      <Link href="/admin/categories" className={itemClass('/admin/categories')} title="Kategori Alat Musik">
        {isActive('/admin/categories') && <ActiveBar />}
        <NavIcon icon={Music2} active={isActive('/admin/categories')} />
        <NavLabel active={isActive('/admin/categories')}>Kategori Alat Musik</NavLabel>
      </Link>
      <Link href="/admin/achievements" className={itemClass('/admin/achievements')} title="Achievement">
        {isActive('/admin/achievements') && <ActiveBar />}
        <NavIcon icon={Award} active={isActive('/admin/achievements')} />
        <NavLabel active={isActive('/admin/achievements')}>Achievement</NavLabel>
      </Link>
      <Link href="/admin/badges" className={itemClass('/admin/badges')} title="Badge">
        {isActive('/admin/badges') && <ActiveBar />}
        <NavIcon icon={BadgeCheck} active={isActive('/admin/badges')} />
        <NavLabel active={isActive('/admin/badges')}>Badge</NavLabel>
      </Link>
      <Link href="/admin/settings" className={itemClass('/admin/settings')} title="Pengaturan">
        {isActive('/admin/settings') && <ActiveBar />}
        <NavIcon icon={Settings} active={isActive('/admin/settings')} />
        <NavLabel active={isActive('/admin/settings')}>Pengaturan</NavLabel>
      </Link>
    </>
  );

  const sidebarContent = (
    <>
      <div
        className={`mb-6 flex shrink-0 px-2 ${
          collapsed
            ? 'lg:flex-col lg:items-center lg:gap-2'
            : 'items-center justify-between'
        }`}
      >
        {/* Logo lengkap */}
        <Link
          href="/"
          className={`flex items-center gap-2.5 ${collapsed ? 'lg:hidden' : ''}`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full ">
            <img src="/images/logo.png" alt="Sonaria" className="h-full w-full" />
          </span>
          <span className="font-[var(--font-pixel)] text-sm text-white">Sonaria</span>
        </Link>

        {/* Logo mini saat collapsed */}
        <Link href="/" className={`hidden ${collapsed ? 'lg:flex' : ''}`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full ">
            <img src="/images/logo.png" alt="Sonaria" className="h-full w-full" />
          </span>
        </Link>

        {/* Tombol tutup drawer mobile */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="rounded-[4px] p-1.5 text-[#93C5FD] hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Tutup menu"
        >
          <X size={20} />
        </button>

        {/* Tombol collapse/expand desktop */}
        <button
          type="button"
          onClick={toggleCollapsed}
          className={`hidden rounded-[4px] p-1.5 text-[#93C5FD] hover:bg-white/5 hover:text-white lg:flex ${
            collapsed ? 'order-first' : 'ml-auto'
          }`}
          aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
        >
          <PanelLeft size={18} />
        </button>
      </div>

      {effectiveCommunityName && role !== 'Admin' && (
        <div
          className={`mb-4 shrink-0 rounded-[4px] border border-white/10 bg-white/[0.03] px-3 py-2.5 ${
            collapsed ? 'lg:hidden' : ''
          }`}
        >
          <div className="font-[var(--font-pixel)] text-[9px] uppercase tracking-[0.18em] text-[#93C5FD]/70">
            Guild aktif
          </div>
          <div className="mt-1 truncate font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2]">
            {effectiveCommunityName}
          </div>
          {effectiveCommunityRole && (
            <div className="mt-1.5">
              <QuestTag color={roleColor(effectiveCommunityRole)}>{effectiveCommunityRole}</QuestTag>
            </div>
          )}
        </div>
      )}

      {/* min-h-0 di sini WAJIB: tanpa ini, flex item defaultnya nggak
          mau nyusut di dalam parent flex-column, jadi overflow-y-auto
          nggak pernah kepakai dan seluruh <aside> yang malah ke-scroll
          (header & tombol logout ikut hilang dari layar di HP pendek). */}
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden overscroll-contain">
        {role === 'Admin' ? adminNav : memberNav}
        {role !== 'Admin' && effectiveCommunityRole && managerNav}
      </nav>

      <div className="mt-4 shrink-0 space-y-1 border-t border-white/10 pt-3">
        {accountNav}
        {effectiveCommunityId && role !== 'Admin' && (
          <button
            type="button"
            onClick={leaveCommunity}
            disabled={leaving}
            title="Keluar Komunitas"
            className={`group relative flex w-full items-center gap-3 rounded-[4px] py-2 pr-3 text-left transition-colors duration-200 disabled:opacity-50 hover:bg-[#F87171]/10 ${
              collapsed ? 'lg:justify-center lg:px-0' : 'pl-2'
            }`}
          >
            <NavIcon icon={DoorOpen} active={false} danger loading={leaving} />
            <span
              className={`font-[var(--font-pixel-mono)] text-[13px] text-[#F87171] ${
                collapsed ? 'lg:hidden' : ''
              }`}
            >
              Keluar Guild
            </span>
          </button>
        )}

        <Link
          href="/logout"
          method="post"
          as="button"
          title="Keluar Akun"
          className={`group relative flex w-full items-center gap-3 rounded-[4px] py-2 pr-3 text-left transition-colors duration-200 hover:bg-[#F87171]/10 ${
            collapsed ? 'lg:justify-center lg:px-0' : 'pl-2'
          }`}
        >
          <NavIcon icon={LogOut} active={false} danger />
          <span
            className={`font-[var(--font-pixel-mono)] text-[13px] text-[#F87171] ${
              collapsed ? 'lg:hidden' : ''
            }`}
          >
            Keluar Akun
          </span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Tombol hamburger, hanya tampil di mobile/tablet. Disembunyikan
          total (bukan cuma ketutup overlay) saat drawer terbuka, supaya
          nggak ke-tab-focus juga. Posisi top pakai safe-area-inset buat
          HP dengan notch/status bar (mis. iPhone). */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Buka menu"
        aria-expanded={mobileOpen}
        aria-controls="mobile-sidebar"
        className={`fixed left-3 z-30 flex items-center justify-center rounded-[4px] border border-white/15 bg-[#0B1120]/90 p-2 text-[#93C5FD] backdrop-blur-sm lg:hidden ${
          mobileOpen ? 'hidden' : ''
        }`}
        style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <Menu size={20} />
      </button>

      {/* Overlay gelap saat drawer mobile terbuka */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#020617]/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: drawer off-canvas di mobile, rail collapsible di desktop.
          bg-[#080B14]/90 + backdrop-blur-xl bikin panel ini kelihatan sebagai
          layer terpisah dari gradient background halaman di belakangnya,
          walau warnanya sama-sama gelap.

          max-w-[85vw] = jaring pengaman di HP super sempit supaya drawer
          nggak pernah lebih lebar dari layar. Scroll dipindah dari <aside>
          ke <nav> (lihat komentar di atas <nav>), jadi di sini overflow
          dihapus dan diganti flex column murni. */}
      <aside
        id="mobile-sidebar"
        role="dialog"
        aria-modal={mobileOpen}
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 max-w-[85vw] shrink-0 flex-col px-3 py-5 text-[#F3EEE2] backdrop-blur-xl transition-all duration-200 ease-out lg:static lg:z-30 lg:max-w-none lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-[4.5rem] lg:px-2' : 'lg:w-64'}`}
        style={{
          backgroundColor: 'rgba(8,11,20,0.9)',
          boxShadow:
            'inset -1px 0 0 rgba(56,189,248,0.18), 6px 0 40px rgba(0,0,0,0.55)',
          paddingLeft: 'max(0.75rem, env(safe-area-inset-left))',
        }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}