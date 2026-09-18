import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
// import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
// import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

// ⚠️ Sesuaikan path ini dengan lokasi asli file quest-ui.tsx di project kamu
import { QuestScreen, PixelPanel, PixelButton, QuestTag } from '@/components/quest/quest-ui';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    // {
    //     title: 'Security',
    //     href: editSecurity(),
    //     icon: null,
    // },
    // {
    //     title: 'Appearance',
    //     href: editAppearance(),
    //     icon: null,
    // },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <QuestScreen>
            <div className="mx-auto max-w-4xl px-4 py-10">
                {/* ===== Header ===== */}
                <div className="mb-1 flex items-center gap-2">
                    <QuestTag color="#818CF8">Quest Log</QuestTag>
                    <h1 className="font-[var(--font-pixel)] text-lg text-[#F3EEE2]">
                        Settings
                    </h1>
                </div>
                <p className="mb-6 font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]">
                    Manage your profile and account settings
                </p>

                <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
                    {/* ===== Sidebar nav ===== */}
                    <aside className="w-full lg:w-52 lg:shrink-0">
                        <PixelPanel>
                            <nav
                                className="flex flex-col gap-1 p-2"
                                aria-label="Settings"
                            >
                                {sidebarNavItems.map((item, index) => {
                                    const active = isCurrentOrParentUrl(item.href);

                                    return (
                                        <Link
                                            key={`${toUrl(item.href)}-${index}`}
                                            href={item.href}
                                        >
                                            <PixelButton
                                                as="span"
                                                variant={active ? 'solid' : 'outline'}
                                                className="!w-full !justify-start !px-3 !py-2 !text-[10px]"
                                            >
                                                {item.icon && (
                                                    <item.icon className="h-3.5 w-3.5" />
                                                )}
                                                {item.title}
                                            </PixelButton>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </PixelPanel>
                    </aside>

                    {/* ===== Content ===== */}
                    <div className="min-w-0 flex-1 space-y-6">{children}</div>
                </div>

                {/* ===== Divider ===== */}
                <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                {/* ===== Back to dashboard ===== */}
                <Link href={dashboard()}>
                    <PixelButton
                        as="span"
                        variant="outline"
                        className="!px-4 !py-2 !text-[10px]"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Kembali ke Dashboard
                    </PixelButton>
                </Link>
            </div>
        </QuestScreen>
    );
}