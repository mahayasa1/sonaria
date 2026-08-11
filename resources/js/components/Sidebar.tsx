import React, {useState} from 'react';
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
} from 'lucide-react';

interface SidebarProps {
  role?: string;
  communityRole?: string | null;
  communityName?: string | null;
}

interface ActiveCommunityShared {
  communities_id: number;
  community_name: string;
  role: string | null;
}

/**
 * Navigasi role-aware. `role` = role global (Admin/Member), `communityRole`
 * = role di dalam komunitas aktif (Ketua/Wakil Ketua/Staff/null).
 */
export default function Sidebar({ role = 'Member', communityRole = null, communityName }: SidebarProps) {
  const { url, props } = usePage<{ activeCommunity: ActiveCommunityShared | null }>();
  const activeCommunity = props.activeCommunity ?? null;

  const effectiveCommunityName = communityName ?? activeCommunity?.community_name ?? null;
  const effectiveCommunityRole = communityRole ?? activeCommunity?.role ?? null;
  const effectiveCommunityId = activeCommunity?.communities_id ?? null;

  const [leaving, setLeaving] = useState(false);

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
      <Link href="/leaderboard" className={itemClass('/leaderboard')}>
        <BarChart3 size={18} /> Leaderboard
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
          <Link href="/manage/main-quests/create" className={itemClass('/manage/main-quests')}>
            <Swords size={18} /> Buat Main Quest
          </Link>
          <Link href="/manage/daily-missions/create" className={itemClass('/manage/daily-missions')}>
            <Flame size={18} /> Buat Daily Mission
          </Link>
          <Link href="/manage/challenge/create" className={itemClass('/manage/challenge')}>
            <Trophy size={18} /> Buat Challenge
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
      <Link href="/dashboard" className={itemClass('/dashboard')}>
        <LayoutGrid size={18} /> Ringkasan
      </Link>
      <Link href="/admin/users" className={itemClass('/admin/users')}>
        <UserCog size={18} /> Pengguna
      </Link>
      <Link href="/admin/communities" className={itemClass('/admin/communities')}>
        <Users size={18} /> Komunitas
      </Link>
      <Link href="/admin/categories" className={itemClass('/admin/categories')}>
        <Music2 size={18} /> Kategori Alat Musik
      </Link>
      <Link href="/admin/achievements" className={itemClass('/admin/achievements')}>
        <Award size={18} /> Achievement
      </Link>
      <Link href="/admin/badges" className={itemClass('/admin/badges')}>
        <BadgeCheck size={18} /> Badge
      </Link>
      <Link href="/admin/settings" className={itemClass('/admin/settings')}>
        <Settings size={18} /> Pengaturan
      </Link>
    </>
  );

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[#2A2333] bg-[#191220] px-3 py-5">
      <Link href="/" className="mb-6 flex items-center gap-2 px-2">
        <Music2 size={22} className="text-[#D9A441]" />
        <span className="font-fraunces text-lg text-[#F3EEE2]">Sonaria</span>
      </Link>

      {effectiveCommunityName && role !== 'Admin' && (
        <div className="mb-4 rounded-lg bg-white/5 px-3 py-2">
          <div className="font-manrope text-[10px] uppercase tracking-[0.14em] text-[#75708A]">
            Komunitas aktif
          </div>
          <div className="truncate text-sm text-[#F3EEE2]">{effectiveCommunityName}</div>
          {effectiveCommunityRole && (
            <div className="mt-0.5 text-xs text-[#D9A441]">{effectiveCommunityRole}</div>
          )}
        </div>
      )}

      <nav className="flex-1 space-y-1">
        {role === 'Admin' ? adminNav : memberNav}
        {role !== 'Admin' && effectiveCommunityRole && managerNav}
      </nav>

      <div className="mt-4 space-y-1 border-t border-[#2A2333] pt-3">
        {/* Ketua tetap bisa coba keluar — backend akan menolak dan
            menampilkan pesan kalau dia harus menunjuk Ketua baru dulu. */}
        {effectiveCommunityId && role !== 'Admin' && (
          <button
            type="button"
            onClick={leaveCommunity}
            disabled={leaving}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#B7AFC2] transition-colors hover:bg-[#C1443C]/10 hover:text-[#C1443C] disabled:opacity-50"
          >
            {leaving ? <Loader2 size={18} className="animate-spin" /> : <DoorOpen size={18} />}
            Keluar Komunitas
          </button>
        )}

        <Link
          href="/logout"
          method="post"
          as="button"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#B7AFC2] hover:bg-white/5 hover:text-[#C1443C]"
        >
          <LogOut size={18} /> Keluar Akun
        </Link>
      </div>
    </aside>
  );
}
