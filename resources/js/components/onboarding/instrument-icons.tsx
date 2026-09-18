import React from 'react';

type IconProps = { className?: string };

const base = 'h-full w-full';

/* ---------------- Brass ---------------- */

export function TrumpetIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className ?? base}
        >
            <path d="M6 30h8l6-4v16l-6-4H6z" />
            <path d="M20 26v12" />
            <rect x="22" y="24" width="4" height="6" rx="1" />
            <rect x="29" y="22" width="4" height="8" rx="1" />
            <rect x="36" y="24" width="4" height="6" rx="1" />
            <path d="M26 27h3M33 27h3" />
            <path d="M40 27h6l12-9v20l-12-9h-6" />
        </svg>
    );
}

export function TromboneIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className ?? base}
        >
            <path d="M6 24h10v6H6z" />
            <path d="M16 27h14" />
            <path d="M30 22v10" />
            <path d="M30 22h16M30 32h16" />
            <path d="M46 22v10" />
            <path d="M46 27h6l10-8v18l-10-8h-6" />
        </svg>
    );
}

export function FrenchHornIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className ?? base}
        >
            <circle cx="26" cy="30" r="14" />
            <circle cx="26" cy="30" r="7.5" />
            <path d="M17 20l-6-6" />
            <path d="M9 12h6v6" />
            <path d="M35 36l8 8h10l-14-12" />
            <path d="M43 44h8v-8" />
        </svg>
    );
}

/* ---------------- Woodwind ---------------- */

export function FluteIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className ?? base}
        >
            <path d="M6 22l10-6" />
            <rect x="12" y="24" width="46" height="9" rx="4.5" />
            <path d="M20 24v9M28 24v9M36 24v9M44 24v9" />
            <circle cx="20" cy="28.5" r="1.4" fill="currentColor" />
            <circle cx="28" cy="28.5" r="1.4" fill="currentColor" />
            <circle cx="36" cy="28.5" r="1.4" fill="currentColor" />
            <circle cx="44" cy="28.5" r="1.4" fill="currentColor" />
        </svg>
    );
}

export function ClarinetIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className ?? base}
        >
            <path d="M28 6h8v6h-8z" />
            <path d="M32 12v34" />
            <path d="M25 46h14l-4 12h-6z" />
            <path d="M26 18h12M26 24h12M26 30h12M26 36h12" />
            <circle cx="32" cy="21" r="1.3" fill="currentColor" />
            <circle cx="32" cy="27" r="1.3" fill="currentColor" />
            <circle cx="32" cy="33" r="1.3" fill="currentColor" />
        </svg>
    );
}

export function SaxophoneIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className ?? base}
        >
            <path d="M22 8l14 8" />
            <path d="M34 14v18" />
            <path d="M34 32c0 8 8 8 8 16a8 8 0 11-16 0" />
            <circle cx="30" cy="20" r="1.3" fill="currentColor" />
            <circle cx="34" cy="24" r="1.3" fill="currentColor" />
            <circle cx="34" cy="29" r="1.3" fill="currentColor" />
        </svg>
    );
}

/* ---------------- Percussion ---------------- */

export function DrumSetIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className ?? base}
        >
            <ellipse cx="32" cy="26" rx="18" ry="7" />
            <path d="M14 26v12c0 3.9 8.1 7 18 7s18-3.1 18-7V26" />
            <path d="M14 26c0-2 3-4 6-5M50 26c0-2-3-4-6-5" />
            <path d="M16 18l14-8M48 18L34 10" />
        </svg>
    );
}

export function KendangIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className ?? base}
        >
            <path d="M10 22c8-4 36-4 44 0v20c-8 4-36 4-44 0z" />
            <ellipse cx="10" cy="22" rx="4" ry="7" />
            <ellipse cx="54" cy="22" rx="4" ry="7" />
            <path d="M16 20l4 4M16 24l4-4M44 20l4 4M44 24l4-4" />
            <path d="M24 20l4 4M24 24l4-4M34 20l4 4M34 24l4-4" />
        </svg>
    );
}

export function MarimbaIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className ?? base}
        >
            <rect x="8" y="34" width="10" height="5" rx="1.5" />
            <rect x="20" y="32" width="12" height="5" rx="1.5" />
            <rect x="34" y="30" width="14" height="5" rx="1.5" />
            <rect x="50" y="28" width="8" height="5" rx="1.5" />
            <path d="M12 39v6M28 37v8M42 35v10" />
            <path d="M18 12l6 10M46 12l-6 10" />
            <circle cx="17" cy="10" r="2.2" />
            <circle cx="47" cy="10" r="2.2" />
        </svg>
    );
}

/* ---------------- String ---------------- */

export function AcousticGuitarIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className ?? base}
        >
            <path d="M30 6l4 4" />
            <path d="M22 8h6v8h-6z" />
            <path d="M32 16v14" />
            <path d="M32 30c-10 0-14 6-14 12s5 12 14 12 14-6 14-12-4-12-14-12z" />
            <circle cx="32" cy="42" r="5" />
            <path d="M25 16h4M25 20h4" />
        </svg>
    );
}

export function ViolinIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className ?? base}
        >
            <circle cx="24" cy="10" r="3" />
            <path d="M24 13v8" />
            <path d="M18 21h12v6H18z" />
            <path d="M20 27c-6 1-8 5-6 9 1.6 3.2 1.6 5-1 7 4 1 8-1 9-5" />
            <path d="M24 38c6 1 8 5 6 9-1.6 3.2-1.6 5 1 7-4 1-8-1-9-5" />
            <path d="M40 27l12 24" />
        </svg>
    );
}

export function CelloIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className ?? base}
        >
            <path d="M28 4h8v8h-8z" />
            <path d="M32 12v10" />
            <path d="M22 22c-6 1-8 5-6 9 1.6 3 1.6 5-1 7 4 1 8-1 9-5" />
            <path d="M26 33c6 1 8 5 6 9-1.6 3-1.6 5 1 7-4 1-8-1-9-5" />
            <path d="M20 24h24v24H20z" opacity="0" />
            <path d="M32 48v10" />
        </svg>
    );
}

export function GenericInstrumentIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className ?? base}
        >
            <path d="M42 8v30a10 10 0 11-6-9V14l6-2z" />
            <circle cx="36" cy="38" r="10" />
        </svg>
    );
}

export const INSTRUMENT_ICON_BY_NAME: Record<string, React.FC<IconProps>> = {
    Trompet: TrumpetIcon,
    Trombon: TromboneIcon,
    'French Horn': FrenchHornIcon,
    Seruling: FluteIcon,
    Klarinet: ClarinetIcon,
    Saksofon: SaxophoneIcon,
    'Drum Set': DrumSetIcon,
    Kendang: KendangIcon,
    Marimba: MarimbaIcon,
    'Gitar Akustik': AcousticGuitarIcon,
    Biola: ViolinIcon,
    Cello: CelloIcon,
};

export const CATEGORY_ICON_BY_NAME: Record<string, React.FC<IconProps>> = {
    Brass: TrumpetIcon,
    Woodwind: FluteIcon,
    Percussion: DrumSetIcon,
    String: ViolinIcon,
};

export function getInstrumentIcon(name: string, categoryName?: string) {
    return (
        INSTRUMENT_ICON_BY_NAME[name] ??
        (categoryName ? CATEGORY_ICON_BY_NAME[categoryName] : undefined) ??
        GenericInstrumentIcon
    );
}

export function getCategoryIcon(name: string) {
    return CATEGORY_ICON_BY_NAME[name] ?? GenericInstrumentIcon;
}
