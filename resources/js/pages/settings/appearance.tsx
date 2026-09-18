import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import { edit as editAppearance } from '@/routes/appearance';

// ⚠️ Sesuaikan path ini dengan lokasi asli file quest-ui.tsx di project kamu
import { QuestScreen, PixelPanel, QuestTag } from '@/components/quest/quest-ui';

export default function Appearance() {
    return (
        <>
            <Head title="Appearance settings" />
            <h1 className="sr-only">Appearance settings</h1>

            <QuestScreen>
                <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
                    <PixelPanel>
                        <div className="p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <QuestTag color="#818CF8">Side Quest</QuestTag>
                                <h3 className="font-[var(--font-pixel)] text-sm text-[#F3EEE2]">
                                    Choose Your Realm Theme
                                </h3>
                            </div>
                            <p className="mb-5 font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]">
                                Update the appearance settings for your account.
                            </p>

                            <AppearanceTabs />
                        </div>
                    </PixelPanel>
                </div>
            </QuestScreen>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Appearance settings',
            href: editAppearance(),
        },
    ],
};