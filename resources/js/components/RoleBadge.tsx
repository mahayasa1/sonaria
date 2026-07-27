import type { ComponentType, ReactNode } from 'react';

/**
 * Pil kecil penanda identitas peran, dipakai di top bar tiap Layout
 * role-specific (Admin/Ketua/Wakil Ketua/Staff/Member).
 */
type RoleBadgeProps = {
  icon: ComponentType<{ size?: number }>;
  label: ReactNode;
  accent?: string;
};

export default function RoleBadge({ icon: Icon, label, accent = '#D9A441' }: RoleBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-manrope text-xs"
      style={{ borderColor: `${accent}40`, backgroundColor: `${accent}14`, color: accent }}
    >
      <Icon size={14} />
      {label}
    </span>
  );
}
