import React from 'react';
import { Link, usePage } from '@inertiajs/react';
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
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  role?: string;
  communityRole?: string | null;
  communityName?: string | null;
}

/**
 * Sidebar role-aware, dibangun di atas primitives shadcn (`@/components/ui/sidebar`)
 * bawaan Laravel React starter kit. `role` = role global (Admin/Member),
 * `communityRole` = role di dalam komunitas aktif (Ketua/Wakil Ketua/Staff/null).
 */
export default function AppSidebar({ role = 'Member', communityRole = null, communityName }: AppSidebarProps) {
  const { url } = usePage();
  const isActive = (href: string) => url.startsWith(href);

  const linkClass = (href: string) =>
    isActive(href)
      ? 'bg-[#D9A441]/12 text-[#D9A441] hover:bg-[#D9A441]/12 hover:text-[#D9A441]'
      : 'text-[#B7AFC2] hover:bg-white/5 hover:text-[#F3EEE2]';

  const NavLink = ({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive(href)} className={linkClass(href)}>
        <Link href={href}>
          <Icon size={18} />
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const memberNav = (
    <SidebarMenu>
      <NavLink href="/dashboard" icon={LayoutGrid}>Ringkasan</NavLink>
      <NavLink href="/main-quests" icon={Swords}>Main Quest</NavLink>
      <NavLink href="/daily-missions" icon={Flame}>Daily Mission</NavLink>
      <NavLink href="/challenge" icon={Trophy}>Challenge</NavLink>
      <NavLink href="/forum" icon={MessageSquare}>Forum</NavLink>
      <NavLink href="/leaderboard" icon={BarChart3}>Leaderboard</NavLink>
    </SidebarMenu>
  );

  const adminNav = (
    <SidebarMenu>
      <NavLink href="/dashboard" icon={LayoutGrid}>Ringkasan</NavLink>
      <NavLink href="/admin/users" icon={UserCog}>Pengguna</NavLink>
      <NavLink href="/admin/communities" icon={Users}>Komunitas</NavLink>
      <NavLink href="/admin/categories" icon={Music2}>Kategori Alat Musik</NavLink>
      <NavLink href="/admin/achievements" icon={Award}>Achievement</NavLink>
      <NavLink href="/admin/badges" icon={BadgeCheck}>Badge</NavLink>
      <NavLink href="/admin/settings" icon={Settings}>Pengaturan</NavLink>
    </SidebarMenu>
  );

  const showManagerGroup = role !== 'Admin' && !!communityRole;

  return (
    <Sidebar collapsible="icon" className="border-[#2A2333] bg-[#191220] text-[#F3EEE2]">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="text-[#F3EEE2] hover:bg-white/5 hover:text-[#F3EEE2]"
            >
              <Link href="/">
                <Music2 size={22} className="text-[#D9A441]" />
                <span className="font-fraunces text-lg">Sonaria</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {communityName && role !== 'Admin' && (
          <div className="mx-2 rounded-lg bg-white/5 px-3 py-2 group-data-[collapsible=icon]:hidden">
            <div className="font-manrope text-[10px] uppercase tracking-[0.14em] text-[#75708A]">
              Komunitas aktif
            </div>
            <div className="truncate text-sm text-[#F3EEE2]">{communityName}</div>
            {communityRole && <div className="mt-0.5 text-xs text-[#D9A441]">{communityRole}</div>}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>{role === 'Admin' ? adminNav : memberNav}</SidebarGroupContent>
        </SidebarGroup>

        {showManagerGroup && (
          <SidebarGroup>
            <SidebarGroupLabel className="font-manrope text-[11px] uppercase tracking-[0.14em] text-[#75708A]">
              Kelola Komunitas
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavLink href="/manage/members" icon={Users}>Anggota &amp; Join Request</NavLink>
                {(communityRole === 'Ketua' || communityRole === 'Wakil Ketua') && (
                  <>
                    <NavLink href="/manage/main-quests/create" icon={Swords}>Buat Main Quest</NavLink>
                    <NavLink href="/manage/daily-missions/create" icon={Flame}>Buat Daily Mission</NavLink>
                    <NavLink href="/manage/challenge/create" icon={Trophy}>Buat Challenge</NavLink>
                  </>
                )}
                <NavLink href="/manage/reviews" icon={ShieldCheck}>Review Submission</NavLink>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-[#B7AFC2] hover:bg-white/5 hover:text-[#C1443C]">
              <Link href="/logout" method="post" as="button">
                <LogOut size={18} />
                <span>Keluar</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}