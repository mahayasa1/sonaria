import React from 'react';

interface StaffProgressProps {
  percentage?: number;
  label?: string;
  value?: string;
  accent?: 'brass' | 'reed' | 'ember';
}

/**
 * StaffProgress — elemen signature Sonaria.
 * Progress bar berbentuk paranada (5 garis not balok), dengan kepala not
 * yang bergeser sepanjang garis sesuai persentase progress. Dipakai untuk
 * XP level, progress main quest, skor quiz, dan progress daily mission.
 *
 * props:
 *  - percentage: 0-100
 *  - label: teks kecil di atas bar (mis. "Level 3 -> 4")
 *  - value: teks kanan (mis. "1.240 / 2.000 XP")
 *  - accent: 'brass' | 'reed' | 'ember'  (warna kepala not & garis progress)
 */
export default function StaffProgress({ percentage = 0, label, value, accent = 'brass' }: StaffProgressProps) {
  const clamped = Math.max(0, Math.min(100, percentage));

  const accentColor = {
    brass: '#D9A441',
    reed: '#4C8C86',
    ember: '#C1443C',
  }[accent] ?? '#D9A441';

  return (
    <div className="w-full">
      {(label || value) && (
        <div className="mb-1.5 flex items-baseline justify-between">
          {label && (
            <span className="font-manrope text-[11px] uppercase tracking-[0.14em] text-[#9C93A8]">
              {label}
            </span>
          )}
          {value && (
            <span className="font-mono text-xs text-[#F3EEE2]">{value}</span>
          )}
        </div>
      )}

      <div className="relative h-6 w-full">
        {/* 5 garis paranada */}
        <div className="absolute inset-0 flex flex-col justify-between py-[3px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-px w-full bg-[#332B40]" />
          ))}
        </div>

        {/* garis progress menimpa sebagian paranada */}
        <div
          className="absolute inset-y-0 left-0 flex flex-col justify-between py-[3px] overflow-hidden transition-[width] duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-px w-full" style={{ backgroundColor: accentColor, opacity: 0.55 }} />
          ))}
        </div>

        {/* kepala not sebagai penanda posisi */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-[left] duration-500 ease-out"
          style={{ left: `calc(${clamped}% - 7px)` }}
        >
          <span
            className="block h-3.5 w-3.5 rotate-[-18deg] rounded-full border-2"
            style={{ backgroundColor: accentColor, borderColor: '#14101B' }}
          />
        </div>
      </div>
    </div>
  );
}
