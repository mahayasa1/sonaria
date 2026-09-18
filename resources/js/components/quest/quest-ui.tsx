import React from 'react';
import OnboardingGradientBackground from '@/components/onboarding/gradient-background';

/** Potongan sudut "patah" ala 8-bit, dipakai di semua panel & tombol quest */
export const PIXEL_CLIP =
  'polygon(0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), 0 calc(100% - 6px))';

/** Bungkus seluruh isi halaman: background gradient + scanline + z-index aman.
 *  Taruh ini sebagai pembungkus PERTAMA di dalam AppLayout/GuestLayout. */
export function QuestScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-[#F3EEE2]">
      <OnboardingGradientBackground />
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)',
        }}
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/** Panel dengan "border" pixel 2 lapis (bukan CSS border biasa, karena border
 *  biasa nggak ikut kepotong rapi sama clip-path patah di atas) */
export function PixelPanel({
  children,
  className = '',
  borderColor = 'rgba(255,255,255,0.18)',
  bg = 'rgba(6,10,25,0.55)',
}: {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  bg?: string;
}) {
  return (
    <div
      className={className}
      style={{ clipPath: PIXEL_CLIP, backgroundColor: borderColor, padding: 2 }}
    >
      <div className="h-full w-full" style={{ clipPath: PIXEL_CLIP, backgroundColor: bg }}>
        {children}
      </div>
    </div>
  );
}

/** Bracket sudut ala "cursor seleksi" di menu game, muncul saat hover.
 *  Taruh di dalam parent yang punya class "group relative". */
export function CornerBrackets({ color = '#38BDF8' }: { color?: string }) {
  const base =
    'pointer-events-none absolute h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100';
  return (
    <>
      <span className={`${base} -left-1 -top-1 border-l-2 border-t-2`} style={{ borderColor: color }} />
      <span className={`${base} -right-1 -top-1 border-r-2 border-t-2`} style={{ borderColor: color }} />
      <span className={`${base} -left-1 -bottom-1 border-b-2 border-l-2`} style={{ borderColor: color }} />
      <span className={`${base} -right-1 -bottom-1 border-b-2 border-r-2`} style={{ borderColor: color }} />
    </>
  );
}

/** Tombol pixel-corner. variant "solid" = gradient terisi (aksi utama),
 *  "outline" = ghost dengan border warna, "danger" = ghost merah. */
export function PixelButton({
  children,
  onClick,
  href,
  variant = 'solid',
  disabled = false,
  className = '',
  as,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'solid' | 'outline' | 'danger';
  disabled?: boolean;
  className?: string;
  as?: React.ElementType;
}) {
  const styleByVariant: Record<string, React.CSSProperties> = {
    solid: {
      background: 'linear-gradient(90deg,#38BDF8,#818CF8)',
      boxShadow: disabled ? 'none' : '0 0 20px rgba(56,189,248,0.35)',
      color: '#0B1120',
    },
    outline: {
      backgroundColor: 'rgba(255,255,255,0.04)',
      border: '2px solid rgba(147,197,253,0.35)',
      color: '#93C5FD',
    },
    danger: {
      backgroundColor: 'rgba(248,113,113,0.08)',
      border: '2px solid rgba(248,113,113,0.35)',
      color: '#F87171',
    },
  };

  const Comp: React.ElementType = as ?? (href ? 'a' : 'button');
  return (
    <Comp
      href={href}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-[var(--font-pixel)] transition-transform disabled:cursor-not-allowed disabled:opacity-40 ${
        !disabled ? 'hover:-translate-y-0.5' : ''
      } ${className}`}
      style={{ clipPath: PIXEL_CLIP, ...styleByVariant[variant] }}
    >
      {children}
    </Comp>
  );
}

/** Progress bar ala XP bar, pengganti StaffProgress supaya visualnya
 *  konsisten dengan tema quest (bukan komponen, jadi nggak perlu ubah
 *  StaffProgress aslinya). */
export function PixelProgress({
  percentage,
  label,
  value,
  color = '#38BDF8',
  colorTo = '#818CF8',
}: {
  percentage: number;
  label?: string;
  value?: string;
  color?: string;
  colorTo?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percentage));
  return (
    <div>
      {(label || value) && (
        <div className="mb-2 flex items-center justify-between font-[var(--font-pixel-mono)] text-[11px] text-[#93C5FD]">
          {label && <span>{label}</span>}
          {value && <span className="text-[#CBD5F5]">{value}</span>}
        </div>
      )}
      <div className="h-3 w-full overflow-hidden rounded-full border border-white/15 bg-white/[0.03]">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${clamped}%`,
            background: `linear-gradient(90deg, ${color}, ${colorTo})`,
            boxShadow: `0 0 10px ${color}99`,
          }}
        />
      </div>
    </div>
  );
}

/** Chip label kecil ala tag quest ("MAIN QUEST", "DAILY", dsb) */
export function QuestTag({
  children,
  color = '#38BDF8',
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className="rounded-full border px-2.5 py-1 text-[9px] font-[var(--font-pixel)] tracking-wider uppercase"
      style={{ borderColor: `${color}55`, color }}
    >
      {children}
    </span>
  );
}