import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  Music2,
  LayoutGrid,
  Swords,
  Flame,
  Trophy,
  MessageSquare,
  Users,
  ShieldCheck,
  UserCog,
  Settings,
  LogOut,
} from 'lucide-react';

/**
 * Navigasi role-aware. `role` = role global (Admin/Member), `communityRole`
 * = role di dalam komunitas aktif (Ketua/Wakil Ketua/Staff/null).
 */
export default function Sidebar({ role = 'Member', communityRole = null, communityName }) {
  const { url } = usePage();

  const isActive = (href) => url.startsWith(href);

  const itemClass = (href) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
      isActive(href)
        ? 'bg-[#D9A441]/12 text-[#D9A441]'
        : 'text-[#B7AFC2] hover:bg-white/5 hover:text-[#F3EEE2]'
    }`;

  const memberNav = (
    <>
      <Link href="/dashboard" className={itemClass('/dashboard')}>
        <LayoutGrid size={18} /> Ringkasan
      </Link>
      <Link href="/main-quests" className={itemClass('/main-quests')}>
        <Swords size={18} /> Main Quest
      </Link>
      <Link href="/daily-missions" className={itemClass('/daily-missions')}>
        <Flame size={18} /> Daily Mission
      </Link>
      <Link href="/challenge" className={itemClass('/challenge')}>
        <Trophy size={18} /> Challenge
      </Link>
      <Link href="/forum" className={itemClass('/forum')}>
        <MessageSquare size={18} /> Forum
      </Link>
    </>
  );

  const managerNav = (
    <>
      <div className="mt-5 mb-2 px-3 font-manrope text-[11px] uppercase tracking-[0.14em] text-[#75708A]">
        Kelola Komunitas
      </div>
      <Link href="/manage/members" className={itemClass('/manage/members')}>
        <Users size={18} /> Anggota &amp; Join Request
      </Link>
      {(communityRole === 'Ketua' || communityRole === 'Wakil Ketua') && (
        <>
          <Link href="/manage/main-quests" className={itemClass('/manage/main-quests')}>
            <Swords size={18} /> Kelola Main Quest
          </Link>
          <Link href="/manage/daily-missions" className={itemClass('/manage/daily-missions')}>
            <Flame size={18} /> Kelola Daily Mission
          </Link>
          <Link href="/manage/challenge" className={itemClass('/manage/challenge')}>
            <Trophy size={18} /> Kelola Challenge
          </Link>
        </>
      )}
      <Link href="/manage/reviews" className={itemClass('/manage/reviews')}>
        <ShieldCheck size={18} /> Review Submission
      </Link>
    </>
  );

  const adminNav = (
    <>
      <Link href="/admin" className={itemClass('/admin')}>
        <LayoutGrid size={18} /> Ringkasan
      </Link>
      <Link href="/admin/users" className={itemClass('/admin/users')}>
        <UserCog size={18} /> Pengguna
      </Link>
      <Link href="/admin/communities" className={itemClass('/admin/communities')}>
        <Users size={18} /> Komunitas
      </Link>
      <Link href="/admin/settings" className={itemClass('/admin/settings')}>
        <Settings size={18} /> Master Data
      </Link>
    </>
  );

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[#2A2333] bg-[#191220] px-3 py-5">
      <Link href="/" className="mb-6 flex items-center gap-2 px-2">
        <Music2 size={22} className="text-[#D9A441]" />
        <span className="font-fraunces text-lg text-[#F3EEE2]">Sonaria</span>
      </Link>

      {communityName && role !== 'Admin' && (
        <div className="mb-4 rounded-lg bg-white/5 px-3 py-2">
          <div className="font-manrope text-[10px] uppercase tracking-[0.14em] text-[#75708A]">
            Komunitas aktif
          </div>
          <div className="truncate text-sm text-[#F3EEE2]">{communityName}</div>
          {communityRole && (
            <div className="mt-0.5 text-xs text-[#D9A441]">{communityRole}</div>
          )}
        </div>
      )}

      <nav className="flex-1 space-y-1">
        {role === 'Admin' ? adminNav : memberNav}
        {role !== 'Admin' && communityRole && managerNav}
      </nav>

      <Link
        href="/logout"
        method="post"
        as="button"
        className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#B7AFC2] hover:bg-white/5 hover:text-[#C1443C]"
      >
        <LogOut size={18} /> Keluar
      </Link>
    </aside>
  );
}
