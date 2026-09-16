import React from 'react';
import { Award, BadgeCheck } from 'lucide-react';

interface BadgeItem {
  badges_id: number;
  badge_name: string;
  description?: string;
  icon?: string;
}

interface AchievementItem {
  achievements_id: number;
  title: string;
  description?: string;
  icon?: string;
}

interface BadgeAchievementShowcaseProps {
  badges?: BadgeItem[];
  achievements?: AchievementItem[];
}

/**
 * BadgeAchievementShowcase — ringkasan Badge & Achievement yang sudah
 * diraih user, dipakai di semua Dashboard (Member, Ketua, Wakil Ketua,
 * Staff) supaya progres gamifikasi selalu terlihat di mana pun user login,
 * bukan cuma di satu halaman. Kalau belum ada yang diraih, tampilkan pesan
 * ajakan yang ramah alih-alih section kosong.
 */
export default function BadgeAchievementShowcase({
  badges = [],
  achievements = [],
}: BadgeAchievementShowcaseProps) {
  return (
    <section className="mt-6 grid gap-5 md:grid-cols-2">
      {/* Badge */}
      <div className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#D9A441]">
            <BadgeCheck size={18} />
            <span className="font-manrope text-sm">Badge</span>
          </div>
          <span className="font-mono text-xs text-[#75708A]">{badges.length}</span>
        </div>

        {badges.length === 0 ? (
          <p className="mt-3 font-manrope text-sm text-[#75708A]">
            Belum ada badge yang diraih. Terus aktif berlatih untuk membukanya.
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b.badges_id}
                title={b.description}
                className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-manrope text-xs text-[#B7AFC2]"
              >
                <BadgeCheck size={12} className="text-[#D9A441]" />
                {b.badge_name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Achievement */}
      <div className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#4C8C86]">
            <Award size={18} />
            <span className="font-manrope text-sm">Achievement</span>
          </div>
          <span className="font-mono text-xs text-[#75708A]">{achievements.length}</span>
        </div>

        {achievements.length === 0 ? (
          <p className="mt-3 font-manrope text-sm text-[#75708A]">
            Belum ada achievement yang diraih. Selesaikan quest & challenge untuk membukanya.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {achievements.map((a) => (
              <div key={a.achievements_id} className="flex items-center gap-2.5 rounded-lg bg-white/5 px-3 py-2">
                <Award size={14} className="shrink-0 text-[#4C8C86]" />
                <div>
                  <p className="font-manrope text-xs text-[#F3EEE2]">{a.title}</p>
                  {a.description && (
                    <p className="font-manrope text-[11px] text-[#75708A]">{a.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
