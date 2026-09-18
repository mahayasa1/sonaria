// Perbaikan untuk resources/js/Pages/settings/profile.tsx
//
// Dua perubahan:
// 1. Preview foto: tambah useState untuk menyimpan object URL dari file
//    yang baru dipilih, dan onChange handler di <input type="file"> yang
//    tadinya kosong sama sekali.
// 2. Notifikasi sukses: baca prop `success` (dikirim dari
//    ProfileController::edit setelah redirect dari update()) dan tampilkan
//    sebagai banner sementara.

import { useEffect, useState, type CSSProperties } from 'react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

import {
    PIXEL_CLIP,
    PixelPanel,
    PixelButton,
    PixelProgress,
    QuestTag,
    CornerBrackets,
} from '@/components/quest/quest-ui';

type PageProps = {
    auth: Auth;
};

type UserProfileData = {
    gender: 'Male' | 'Female' | null;
    birth_date: string | null;
    phone: string | null;
    address: string | null;
    province: string | null;
    city: string | null;
    profile_completed: boolean;
} | null;

const inputStyle: CSSProperties = {
    clipPath: PIXEL_CLIP,
    border: '2px solid rgba(147,197,253,0.25)',
};

const inputClass =
    'w-full bg-white/[0.04] px-4 py-2.5 font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2] outline-none placeholder:text-[#93C5FD]/40 focus:bg-white/[0.07]';

const labelClass =
    'font-[var(--font-pixel-mono)] text-[11px] uppercase tracking-wider text-[#93C5FD]';

export default function Profile({
    mustVerifyEmail,
    status,
    success,
    profile,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    success?: string;
    profile: UserProfileData;
}) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;

    // Preview foto yang baru dipilih (belum di-submit). null = belum ada
    // file baru dipilih, jadi masih tampilkan foto lama dari server.
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    // Bersihkan object URL saat komponen unmount / preview berganti,
    // supaya tidak bocor memori (createObjectURL menahan referensi file
    // di memori sampai di-revoke manual).
    useEffect(() => {
        return () => {
            if (photoPreview) URL.revokeObjectURL(photoPreview);
        };
    }, [photoPreview]);

    function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) {
            setPhotoPreview(null);
            return;
        }
        // Revoke preview sebelumnya sebelum bikin yang baru.
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoPreview(URL.createObjectURL(file));
    }

    // Notifikasi sukses tampil sebentar lalu hilang sendiri.
    const [showSuccess, setShowSuccess] = useState(Boolean(success));
    useEffect(() => {
        if (!success) return;
        setShowSuccess(true);
        const t = setTimeout(() => setShowSuccess(false), 4000);
        return () => clearTimeout(t);
    }, [success]);

    if (!user) {
        return (
            <>
                <Head title="Profile settings" />
                <p className="p-6 text-sm text-muted-foreground">
                    Loading profile…
                </p>
            </>
        );
    }

    const isVerified = mustVerifyEmail ? user.email_verified_at !== null : true;
    const birthDateValue = profile?.birth_date ? profile.birth_date.slice(0, 10) : '';

    const checks = [
        Boolean(user.name),
        Boolean(user.email),
        Boolean(user.photo),
        isVerified,
        Boolean(profile?.gender),
        Boolean(profile?.birth_date),
        Boolean(profile?.phone),
        Boolean(profile?.address),
        Boolean(profile?.province),
        Boolean(profile?.city),
    ];
    const completion = Math.round(
        (checks.filter(Boolean).length / checks.length) * 100,
    );

    return (
        <>
            <Head title="Profile settings" />
            <h1 className="sr-only">Profile settings</h1>

            {/* Notifikasi sukses */}
            {showSuccess && success && (
                <div
                    className="mb-4 rounded-[4px] border border-[#34D399]/40 bg-[#34D399]/10 px-4 py-2.5 font-[var(--font-pixel-mono)] text-sm text-[#34D399]"
                    role="status"
                >
                    {success}
                </div>
            )}

            <div className="space-y-6">
                    {/* ===== Character Banner ===== */}
                    <PixelPanel>
                        <div className="flex flex-col items-center gap-6 p-6 sm:flex-row">
                            <div className="group relative shrink-0">
                                <div
                                    className="h-24 w-24 overflow-hidden bg-gradient-to-br from-[#38BDF8]/30 to-[#818CF8]/30"
                                    style={{ clipPath: PIXEL_CLIP }}
                                >
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Preview foto baru"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : user.photo ? (
                                        <img
                                            src={`/storage/${user.photo}`}
                                            alt={user.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center font-[var(--font-pixel)] text-2xl text-[#93C5FD]">
                                            {user.name?.[0]?.toUpperCase() ?? '?'}
                                        </div>
                                    )}
                                </div>
                                <CornerBrackets color="#38BDF8" />
                            </div>

                            <div className="flex-1 space-y-2 text-center sm:text-left">
                                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                    <QuestTag color="#38BDF8">Adventurer</QuestTag>
                                    <QuestTag color={profile?.profile_completed ? '#34D399' : '#FBBF24'}>
                                        {profile?.profile_completed ? 'Profile Complete' : 'Profile Incomplete'}
                                    </QuestTag>
                                </div>

                                <h2 className="font-[var(--font-pixel)] text-lg text-[#F3EEE2]">
                                    {user.name}
                                </h2>
                                <p className="font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]">
                                    {user.email}
                                </p>

                                <div className="pt-2">
                                    <PixelProgress
                                        percentage={completion}
                                        label="Character Completion"
                                        value={`${completion}%`}
                                    />
                                </div>
                            </div>
                        </div>
                    </PixelPanel>

                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                {/* ===== Character Details Quest ===== */}
                                <PixelPanel>
                                    <div className="p-6">
                                        <div className="mb-5 flex items-center gap-2">
                                            <QuestTag color="#818CF8">Main Quest</QuestTag>
                                            <h3 className="font-[var(--font-pixel)] text-sm text-[#F3EEE2]">
                                                Update Character Details
                                            </h3>
                                        </div>

                                        <div className="space-y-5">
                                            {/* Portrait upload */}
                                            <div className="grid gap-2">
                                                <label htmlFor="photo" className={labelClass}>
                                                    Portrait
                                                </label>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <PixelButton
                                                        as="label"
                                                        variant="outline"
                                                        className="cursor-pointer"
                                                    >
                                                        Change Portrait
                                                        <input
                                                            id="photo"
                                                            type="file"
                                                            name="photo"
                                                            accept="image/png,image/jpeg,image/webp"
                                                            className="sr-only"
                                                            onChange={handlePhotoChange}
                                                        />
                                                    </PixelButton>
                                                    {photoPreview && (
                                                        <span className="font-[var(--font-pixel-mono)] text-[10px] text-[#34D399]">
                                                            Foto baru dipilih — klik Save Progress untuk menyimpan
                                                        </span>
                                                    )}
                                                    <p className="font-[var(--font-pixel-mono)] text-[10px] text-[#CBD5F5]/70">
                                                        JPG, PNG, or WEBP. Max 100MB.
                                                    </p>
                                                </div>
                                                <InputError className="mt-1" message={errors.photo} />
                                            </div>

                                            {/* Name */}
                                            <div className="grid gap-2">
                                                <label htmlFor="name" className={labelClass}>
                                                    Character Name
                                                </label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    autoComplete="name"
                                                    placeholder="Full name"
                                                    defaultValue={user.name}
                                                    className={inputClass}
                                                    style={inputStyle}
                                                />
                                                <InputError message={errors.name} />
                                            </div>

                                            {/* Email */}
                                            <div className="grid gap-2">
                                                <label htmlFor="email" className={labelClass}>
                                                    Contact Scroll (Email)
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoComplete="username"
                                                    placeholder="Email address"
                                                    defaultValue={user.email}
                                                    className={inputClass}
                                                    style={inputStyle}
                                                />
                                                <InputError message={errors.email} />
                                            </div>
                                        </div>
                                    </div>
                                </PixelPanel>

                                {/* ===== Adventurer Stats Quest ===== */}
                                <PixelPanel>
                                    <div className="p-6">
                                        <div className="mb-5 flex items-center gap-2">
                                            <QuestTag color="#818CF8">Side Quest</QuestTag>
                                            <h3 className="font-[var(--font-pixel)] text-sm text-[#F3EEE2]">
                                                Adventurer Stats
                                            </h3>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="grid gap-5 sm:grid-cols-2">
                                                {/* Gender */}
                                                <div className="grid gap-2">
                                                    <label htmlFor="gender" className={labelClass}>
                                                        Gender
                                                    </label>
                                                    <select
                                                        id="gender"
                                                        name="gender"
                                                        defaultValue={profile?.gender ?? ''}
                                                        className={`${inputClass} appearance-none`}
                                                        style={inputStyle}
                                                    >
                                                        <option value="" className="bg-[#0B1120]">
                                                            Select gender
                                                        </option>
                                                        <option value="Male" className="bg-[#0B1120]">
                                                            Male
                                                        </option>
                                                        <option value="Female" className="bg-[#0B1120]">
                                                            Female
                                                        </option>
                                                    </select>
                                                    <InputError message={errors.gender} />
                                                </div>

                                                {/* Birth date */}
                                                <div className="grid gap-2">
                                                    <label htmlFor="birth_date" className={labelClass}>
                                                        Birth Date
                                                    </label>
                                                    <input
                                                        id="birth_date"
                                                        type="date"
                                                        name="birth_date"
                                                        defaultValue={birthDateValue}
                                                        className={inputClass}
                                                        style={inputStyle}
                                                    />
                                                    <InputError message={errors.birth_date} />
                                                </div>
                                            </div>

                                            {/* Phone */}
                                            <div className="grid gap-2">
                                                <label htmlFor="phone" className={labelClass}>
                                                    Phone Number
                                                </label>
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    name="phone"
                                                    autoComplete="tel"
                                                    placeholder="e.g. 081234567890"
                                                    defaultValue={profile?.phone ?? ''}
                                                    className={inputClass}
                                                    style={inputStyle}
                                                />
                                                <InputError message={errors.phone} />
                                            </div>

                                            {/* Address */}
                                            <div className="grid gap-2">
                                                <label htmlFor="address" className={labelClass}>
                                                    Address
                                                </label>
                                                <textarea
                                                    id="address"
                                                    name="address"
                                                    rows={3}
                                                    placeholder="Street, house number, etc."
                                                    defaultValue={profile?.address ?? ''}
                                                    className={`${inputClass} resize-none`}
                                                    style={inputStyle}
                                                />
                                                <InputError message={errors.address} />
                                            </div>

                                            <div className="grid gap-5 sm:grid-cols-2">
                                                {/* Province */}
                                                <div className="grid gap-2">
                                                    <label htmlFor="province" className={labelClass}>
                                                        Province
                                                    </label>
                                                    <input
                                                        id="province"
                                                        name="province"
                                                        placeholder="Province"
                                                        defaultValue={profile?.province ?? ''}
                                                        className={inputClass}
                                                        style={inputStyle}
                                                    />
                                                    <InputError message={errors.province} />
                                                </div>

                                                {/* City */}
                                                <div className="grid gap-2">
                                                    <label htmlFor="city" className={labelClass}>
                                                        City
                                                    </label>
                                                    <input
                                                        id="city"
                                                        name="city"
                                                        placeholder="City"
                                                        defaultValue={profile?.city ?? ''}
                                                        className={inputClass}
                                                        style={inputStyle}
                                                    />
                                                    <InputError message={errors.city} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </PixelPanel>

                                <PixelButton
                                    variant="solid"
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    {processing ? 'Saving...' : 'Save Progress'}
                                </PixelButton>
                            </>
                        )}
                    </Form>

                    {/* ===== Danger Zone ===== */}
                    <PixelPanel
                        borderColor="rgba(248,113,113,0.3)"
                        bg="rgba(69,10,10,0.25)"
                    >
                        <div className="p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <QuestTag color="#F87171">Point of No Return</QuestTag>
                            <h3 className="font-[var(--font-pixel)] text-sm text-[#F87171]">
                                Abandon Character
                            </h3>
                        </div>
                        <DeleteUser />
                    </div>
                </PixelPanel>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};