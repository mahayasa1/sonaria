import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { landing } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import OnboardingGradientBackground from '@/components/onboarding/gradient-background'; // sesuaikan path import-nya

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden p-6 md:p-10">
            {/* background gradient */}
            <OnboardingGradientBackground />

            {/* konten di atas gradient */}
            <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={landing()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                {/* <AppLogoIcon className="size-9 fill-current text-white" /> */}
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium text-white">{title}</h1>
                            <p className="text-center text-sm text-white/70">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}