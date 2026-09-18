import React, { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Check,
    ChevronRight,
    Loader2,
    Music2,
    Sparkles,
    X,
} from 'lucide-react';
import OnboardingGradientBackground from '@/components/onboarding/gradient-background';
import {
    getCategoryIcon,
    getInstrumentIcon,
} from '@/components/onboarding/instrument-icons';
import {
    getInstrumentDetail,
    starsForDifficulty,
    difficultyLabel,
} from '@/components/onboarding/instrument-data';

interface Instrument {
    intruments_id: number;
    name: string;
    description?: string;
    image?: string;
    difficulty?: string;
}

interface Category {
    music_categories_id: number;
    name: string;
    description?: string;
    instruments: Instrument[];
}

function PixelStars({ count, total = 5 }: { count: number; total?: number }) {
    return (
        <div
            className="flex items-center gap-1"
            aria-label={`${count} dari ${total} bintang`}
        >
            {Array.from({ length: total }).map((_, i) => (
                <Sparkles
                    key={i}
                    size={16}
                    className={
                        i < count
                            ? 'fill-[#FBBF24] text-[#FBBF24]'
                            : 'text-white/15'
                    }
                />
            ))}
        </div>
    );
}

export default function Category({
    categories,
    currentInstrumentId,
}: {
    categories: Category[];
    currentInstrumentId: number | null;
}) {
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
        null,
    );
    const [panelMounted, setPanelMounted] = useState(false);
    const [closing, setClosing] = useState(false);
    const [instrumentIndex, setInstrumentIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(
        currentInstrumentId,
    );
    const [submitting, setSubmitting] = useState(false);
    const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (closeTimeout.current) clearTimeout(closeTimeout.current);
        },
        [],
    );

    const activeCategory =
        categories.find((c) => c.music_categories_id === activeCategoryId) ??
        null;
    const instruments = activeCategory?.instruments ?? [];
    const currentInstrument = instruments[instrumentIndex] ?? null;

    const openCategory = (id: number) => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        setClosing(false);
        setActiveCategoryId(id);
        setInstrumentIndex(0);
        setPanelMounted(true);
    };

    const closePanel = () => {
        setClosing(true);
        closeTimeout.current = setTimeout(() => {
            setPanelMounted(false);
            setClosing(false);
            setActiveCategoryId(null);
        }, 280);
    };

    const nextInstrument = () => {
        if (instruments.length === 0) return;
        setInstrumentIndex((i) => (i + 1) % instruments.length);
    };

    const submit = () => {
        if (!selected) return;
        setSubmitting(true);
        router.post(
            '/onboarding/instrument',
            { instrument_id: selected },
            { onFinish: () => setSubmitting(false) },
        );
    };

    const isEditing = currentInstrumentId !== null;
    const detail = currentInstrument
        ? getInstrumentDetail(
              currentInstrument.name,
              currentInstrument.description,
          )
        : null;
    const CurrentIcon = currentInstrument
        ? getInstrumentIcon(currentInstrument.name, activeCategory?.name)
        : null;

    return (
        <div className="relative min-h-screen overflow-x-hidden text-[#F3EEE2]">
            <Head title="Pilih Kategori Alat Musik" />
            <OnboardingGradientBackground />
            <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 py-14">
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 py-14">
                {/* Logo badge */}
                <div className="relative flex h-26 w-26 items-center justify-center">
                    <img src="/images/logo.png" alt="Sonaria" className="" />
                </div>

                <p className="mt-6 text-[10px] font-[var(--font-pixel)] tracking-[0.25em] text-[#93C5FD] uppercase">
                    {isEditing ? 'Ganti instrumen' : 'Satu langkah lagi'}
                </p>
                <h1 className="mt-4 max-w-2xl text-center text-xl leading-relaxed font-[var(--font-pixel)] text-white [text-shadow:0_0_18px_rgba(147,197,253,0.35)] sm:text-2xl md:text-3xl">
                    Choose the Instrument Category
                </h1>
                <p className="mt-5 max-w-xl text-center text-lg font-[var(--font-pixel-mono)] text-[#C7D2FE]">
                    Instrumen yang kamu pilih menentukan komunitas dan materi
                    yang akan direkomendasikan untukmu. Kamu hanya bisa memilih
                    satu.
                </p>

                {/* Category tiles */}
                <div className="mt-12 grid w-full grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                    {categories.map((cat) => {
                        const Icon = getCategoryIcon(cat.name);
                        const isActive =
                            activeCategoryId === cat.music_categories_id;
                        const hasSelection = cat.instruments.some(
                            (i) => i.intruments_id === selected,
                        );

                        return (
                            <button
                                key={cat.music_categories_id}
                                onClick={() =>
                                    openCategory(cat.music_categories_id)
                                }
                                className={`group flex min-h-[220px] flex-col items-center justify-center gap-5 rounded-2xl border-2 bg-white/[0.04] px-4 py-8 backdrop-blur-sm transition-all duration-300 sm:min-h-[260px] ${
                                    isActive || hasSelection
                                        ? 'border-[#38BDF8] bg-[#38BDF8]/10 shadow-[0_0_35px_rgba(56,189,248,0.3)]'
                                        : 'border-white/15 hover:border-[#38BDF8]/50 hover:bg-white/[0.06]'
                                }`}
                            >
                                <span
                                    className={`h-14 w-14 sm:h-16 sm:w-16 ${
                                        isActive || hasSelection
                                            ? 'text-[#38BDF8]'
                                            : 'text-[#93C5FD] group-hover:text-[#38BDF8]'
                                    }`}
                                >
                                    <Icon />
                                </span>
                                <span className="text-sm font-[var(--font-pixel)] tracking-widest text-white/90 uppercase sm:text-base">
                                    {cat.name}
                                </span>
                                {hasSelection && (
                                    <span className="flex items-center gap-1 text-[10px] font-[var(--font-pixel)] text-[#38BDF8]">
                                        <Check size={12} /> DIPILIH
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Final CTA */}
                <div className="mt-14 flex justify-end self-end">
                    <button
                        onClick={submit}
                        disabled={!selected || submitting}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#818CF8] px-7 py-3 text-xs font-[var(--font-pixel)] text-[#0B1120] shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-opacity hover:opacity-90 disabled:opacity-30"
                    >
                        {submitting && (
                            <Loader2 size={16} className="animate-spin" />
                        )}
                        Lanjut cari komunitas
                    </button>
                </div>
            </div>

            {/* Backdrop + bottom-sheet detail panel */}
            {panelMounted && activeCategory && (
                <>
                    <div
                        className={`fixed inset-0 z-30 bg-[#020617]/60 backdrop-blur-sm transition-opacity duration-300 ${
                            closing ? 'opacity-0' : 'opacity-100'
                        }`}
                        onClick={closePanel}
                        aria-hidden
                    />

                    <div
                        key={activeCategory.music_categories_id}
                        className={`fixed top-1/2 left-1/2 z-40 w-[90vw] max-w-sm ${
                            closing ? 'animate-panel-out' : 'animate-panel-in'
                        }`}
                    >
                        <div className="relative max-h-[82vh] overflow-y-auto rounded-2xl border-2 border-[#38BDF8]/40 bg-[#0B1120]/95 p-6 shadow-[0_0_60px_rgba(56,189,248,0.25)]">
                            <button
                                onClick={closePanel}
                                className="absolute top-4 right-4 rounded-full border border-white/15 p-1.5 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                                aria-label="Tutup"
                            >
                                <X size={14} />
                            </button>

                            {currentInstrument ? (
                                <>
                                    <h2 className="pr-8 text-lg font-[var(--font-pixel)] text-white">
                                        {currentInstrument.name.toUpperCase()}
                                    </h2>
                                    <div className="mt-2 flex items-center gap-3">
                                        <PixelStars
                                            count={starsForDifficulty(
                                                currentInstrument.difficulty,
                                            )}
                                        />
                                        {currentInstrument.difficulty && (
                                            <span className="text-[9px] font-[var(--font-pixel)] tracking-widest text-[#93C5FD] uppercase">
                                                {difficultyLabel(
                                                    currentInstrument.difficulty,
                                                )}
                                            </span>
                                        )}
                                    </div>

                                    <div className="my-5 flex h-28 items-center justify-center">
                                        {CurrentIcon && (
                                            <span className="h-24 w-24 text-[#60A5FA]">
                                                <CurrentIcon />
                                            </span>
                                        )}
                                    </div>

                                    <hr className="border-white/10" />

                                    {detail && detail.description && (
                                        <div className="mt-4">
                                            <h3 className="text-xs font-[var(--font-pixel)] text-white">
                                                Description
                                            </h3>
                                            <p className="mt-2 text-base leading-snug font-[var(--font-pixel-mono)] text-[#CBD5F5]">
                                                {detail.description}
                                            </p>
                                        </div>
                                    )}

                                    {detail &&
                                        detail.characteristics.length > 0 && (
                                            <>
                                                <hr className="my-4 border-white/10" />
                                                <h3 className="text-xs font-[var(--font-pixel)] text-white">
                                                    Karakteristik
                                                </h3>
                                                <ul className="mt-2 space-y-1 text-base font-[var(--font-pixel-mono)] text-[#CBD5F5]">
                                                    {detail.characteristics.map(
                                                        (c, i) => (
                                                            <li
                                                                key={i}
                                                                className="flex gap-2"
                                                            >
                                                                <span className="text-[#38BDF8]">
                                                                    &bull;
                                                                </span>
                                                                <span>{c}</span>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </>
                                        )}

                                    {detail &&
                                        (detail.advantages.length > 0 ||
                                            detail.challenges.length > 0) && (
                                            <>
                                                <hr className="my-4 border-white/10" />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <h3 className="text-[10px] font-[var(--font-pixel)] text-[#4ADE80]">
                                                            Kelebihan
                                                        </h3>
                                                        <ul className="mt-2 space-y-1 text-sm font-[var(--font-pixel-mono)] text-[#CBD5F5]">
                                                            {detail.advantages.map(
                                                                (a, i) => (
                                                                    <li
                                                                        key={i}
                                                                        className="flex gap-1.5"
                                                                    >
                                                                        <span className="text-[#4ADE80]">
                                                                            &bull;
                                                                        </span>
                                                                        <span>
                                                                            {a}
                                                                        </span>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[10px] font-[var(--font-pixel)] text-[#F87171]">
                                                            Tantangan
                                                        </h3>
                                                        <ul className="mt-2 space-y-1 text-sm font-[var(--font-pixel-mono)] text-[#CBD5F5]">
                                                            {detail.challenges.map(
                                                                (c, i) => (
                                                                    <li
                                                                        key={i}
                                                                        className="flex gap-1.5"
                                                                    >
                                                                        <span className="text-[#F87171]">
                                                                            &bull;
                                                                        </span>
                                                                        <span>
                                                                            {c}
                                                                        </span>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                    <div className="mt-6 flex items-center justify-between">
                                        <button
                                            onClick={() =>
                                                setSelected(
                                                    currentInstrument.intruments_id,
                                                )
                                            }
                                            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-[9px] font-[var(--font-pixel)] tracking-wide uppercase transition-colors ${
                                                selected ===
                                                currentInstrument.intruments_id
                                                    ? 'border-[#38BDF8] bg-[#38BDF8]/15 text-[#38BDF8]'
                                                    : 'border-white/20 text-white/70 hover:border-[#38BDF8]/50 hover:text-white'
                                            }`}
                                        >
                                            {selected ===
                                                currentInstrument.intruments_id && (
                                                <Check size={12} />
                                            )}
                                            Pilih ini
                                        </button>

                                        {instruments.length > 1 && (
                                            <button
                                                onClick={nextInstrument}
                                                className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#818CF8] px-5 py-2.5 text-[10px] font-[var(--font-pixel)] text-[#0B1120] shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-opacity hover:opacity-90"
                                            >
                                                next
                                                <ChevronRight size={14} />
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p className="text-base font-[var(--font-pixel-mono)] text-[#93C5FD]">
                                    Belum ada instrumen di kategori ini.
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}
            </div>
        </div>
    );
}
