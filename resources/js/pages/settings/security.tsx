import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
import { edit } from '@/routes/security';

// ⚠️ Sesuaikan path ini dengan lokasi asli file quest-ui.tsx di project kamu
import {
    PIXEL_CLIP,
    QuestScreen,
    PixelPanel,
    PixelButton,
    QuestTag,
} from '@/components/quest/quest-ui';

type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Security settings" />
            <h1 className="sr-only">Security settings</h1>

            <QuestScreen>
                <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
                    {/* ===== Password Vault Quest ===== */}
                    <PixelPanel>
                        <div className="p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <QuestTag color="#818CF8">Main Quest</QuestTag>
                                <h3 className="font-[var(--font-pixel)] text-sm text-[#F3EEE2]">
                                    Reforge Your Password
                                </h3>
                            </div>
                            <p className="mb-5 font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]">
                                Ensure your account is using a long, random password to
                                stay secure.
                            </p>

                            <Form
                                {...SecurityController.update.form()}
                                options={{ preserveScroll: true }}
                                resetOnError={[
                                    'password',
                                    'password_confirmation',
                                    'current_password',
                                ]}
                                resetOnSuccess
                                onError={(errors) => {
                                    if (errors.password) {
                                        passwordInput.current?.focus();
                                    }
                                    if (errors.current_password) {
                                        currentPasswordInput.current?.focus();
                                    }
                                }}
                                className="space-y-5"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        {/* Current password */}
                                        <div className="grid gap-2">
                                            <label
                                                htmlFor="current_password"
                                                className="font-[var(--font-pixel-mono)] text-[11px] uppercase tracking-wider text-[#93C5FD]"
                                            >
                                                Current Password
                                            </label>
                                            <input
                                                id="current_password"
                                                ref={currentPasswordInput}
                                                type="password"
                                                name="current_password"
                                                autoComplete="current-password"
                                                placeholder="Current password"
                                                className="w-full bg-white/[0.04] px-4 py-2.5 font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2] outline-none placeholder:text-[#93C5FD]/40 focus:bg-white/[0.07]"
                                                style={{
                                                    clipPath: PIXEL_CLIP,
                                                    border: '2px solid rgba(147,197,253,0.25)',
                                                }}
                                            />
                                            <InputError message={errors.current_password} />
                                        </div>

                                        {/* New password */}
                                        <div className="grid gap-2">
                                            <label
                                                htmlFor="password"
                                                className="font-[var(--font-pixel-mono)] text-[11px] uppercase tracking-wider text-[#93C5FD]"
                                            >
                                                New Password
                                            </label>
                                            <input
                                                id="password"
                                                ref={passwordInput}
                                                type="password"
                                                name="password"
                                                autoComplete="new-password"
                                                placeholder="New password"
                                                passwordrules={props.passwordRules}
                                                className="w-full bg-white/[0.04] px-4 py-2.5 font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2] outline-none placeholder:text-[#93C5FD]/40 focus:bg-white/[0.07]"
                                                style={{
                                                    clipPath: PIXEL_CLIP,
                                                    border: '2px solid rgba(147,197,253,0.25)',
                                                }}
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Confirm password */}
                                        <div className="grid gap-2">
                                            <label
                                                htmlFor="password_confirmation"
                                                className="font-[var(--font-pixel-mono)] text-[11px] uppercase tracking-wider text-[#93C5FD]"
                                            >
                                                Confirm Password
                                            </label>
                                            <input
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                autoComplete="new-password"
                                                placeholder="Confirm password"
                                                passwordrules={props.passwordRules}
                                                className="w-full bg-white/[0.04] px-4 py-2.5 font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2] outline-none placeholder:text-[#93C5FD]/40 focus:bg-white/[0.07]"
                                                style={{
                                                    clipPath: PIXEL_CLIP,
                                                    border: '2px solid rgba(147,197,253,0.25)',
                                                }}
                                            />
                                            <InputError message={errors.password_confirmation} />
                                        </div>

                                        <div className="pt-2">
                                            <PixelButton
                                                variant="solid"
                                                disabled={processing}
                                                data-test="update-password-button"
                                            >
                                                {processing ? 'Saving...' : 'Seal Password'}
                                            </PixelButton>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </PixelPanel>

                    {/* ===== Two-Factor Ward ===== */}
                    <PixelPanel>
                        <div className="p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <QuestTag color="#38BDF8">Side Quest</QuestTag>
                                <h3 className="font-[var(--font-pixel)] text-sm text-[#F3EEE2]">
                                    Two-Factor Ward
                                </h3>
                            </div>
                            <ManageTwoFactor
                                canManageTwoFactor={props.canManageTwoFactor}
                                requiresConfirmation={props.requiresConfirmation}
                                twoFactorEnabled={props.twoFactorEnabled}
                            />
                        </div>
                    </PixelPanel>

                    {/* ===== Passkeys Relics ===== */}
                    <PixelPanel>
                        <div className="p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <QuestTag color="#38BDF8">Side Quest</QuestTag>
                                <h3 className="font-[var(--font-pixel)] text-sm text-[#F3EEE2]">
                                    Passkey Relics
                                </h3>
                            </div>
                            <ManagePasskeys
                                canManagePasskeys={props.canManagePasskeys}
                                passkeys={props.passkeys}
                            />
                        </div>
                    </PixelPanel>
                </div>
            </QuestScreen>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Security settings',
            href: edit(),
        },
    ],
};