import React from 'react';
import { Award, BadgeCheck } from 'lucide-react';
import { PixelPanel, QuestTag } from '@/components/quest/quest-ui';

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
    <section className="grid gap-5 md:grid-cols-2">
      {/* Badge */}
      <PixelPanel>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#FBBF24]">
              <BadgeCheck size={18} />
              <span className="text-[10px] font-[var(--font-pixel)] uppercase tracking-[0.2em]">
                Badge
              </span>
            </div>
            <span className="font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/60">
              {badges.length}
            </span>
          </div>

          {badges.length === 0 ? (
            <p className="mt-3 font-[var(--font-pixel-mono)] text-sm text-[#93C5FD]/60">
              Belum ada badge yang diraih. Terus aktif berlatih untuk membukanya.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span key={b.badges_id} title={b.description}>
                  <QuestTag color="#FBBF24">{b.badge_name}</QuestTag>
                </span>
              ))}
            </div>
          )}
        </div>
      </PixelPanel>

      {/* Achievement */}
      <PixelPanel>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#4ADE80]">
              <Award size={18} />
              <span className="text-[10px] font-[var(--font-pixel)] uppercase tracking-[0.2em]">
                Achievement
              </span>
            </div>
            <span className="font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/60">
              {achievements.length}
            </span>
          </div>

          {achievements.length === 0 ? (
            <p className="mt-3 font-[var(--font-pixel-mono)] text-sm text-[#93C5FD]/60">
              Belum ada achievement yang diraih. Selesaikan quest &amp; challenge untuk membukanya.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {achievements.map((a) => (
                <div
                  key={a.achievements_id}
                  className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
                >
                  <Award size={14} className="shrink-0 text-[#4ADE80]" />
                  <div>
                    <p className="font-[var(--font-pixel-mono)] text-xs text-[#F3EEE2]">{a.title}</p>
                    {a.description && (
                      <p className="mt-0.5 font-[var(--font-pixel-mono)] text-[11px] text-[#93C5FD]/60">
                        {a.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PixelPanel>
    </section>
  );
}