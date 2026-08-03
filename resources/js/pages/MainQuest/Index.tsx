import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import EmptyState from '@/components/EmptyState';
import StaffProgress from '@/components/StaffProgress';
import { Swords, Lock, CheckCircle2, PlayCircle } from 'lucide-react';

interface Quest {
  main_quests_id: number;
  level: number;
  title: string;
  description?: string;
  xp_reward: number;
  status: string;
  is_completed: boolean;
}

export default function Index({
  community,
  mainQuests,
}: {
  community: { community_name: string };
  mainQuests: Quest[];
}) {
  const completedCount = mainQuests.filter((q) => q.is_completed).length;

  return (
    <AppLayout title="Main Quest" role="Member" communityName={community.community_name}>
      <header className="flex items-center justify-between">
        <div>
          <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
            {community.community_name}
          </p>
          <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
            <Swords size={24} className="text-[#D9A441]" /> Main Quest
          </h1>
        </div>
        <span className="font-mono text-sm text-[#D9A441]">{completedCount} / 7 birama</span>
      </header>

      <div className="mt-4">
        <StaffProgress percentage={(completedCount / 7) * 100} accent="brass" />
      </div>

      {mainQuests.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Swords}
            title="Main Quest belum tersedia"
            description="Pengelola komunitas belum menerbitkan birama Main Quest."
          />
        </div>
      ) : (
        <ol className="mt-8 space-y-3">
          {mainQuests.map((quest, i) => {
            const unlocked = i === 0 || mainQuests[i - 1]?.is_completed;
            const StatusIcon = quest.is_completed ? CheckCircle2 : unlocked ? PlayCircle : Lock;
            const iconColor = quest.is_completed ? '#4C8C86' : unlocked ? '#D9A441' : '#75708A';

            const Card = (
              <div
                className={`flex items-center gap-4 rounded-xl border p-5 transition-colors ${
                  unlocked
                    ? 'border-[#2A2333] bg-[#1E1826] hover:border-[#D9A441]/40'
                    : 'border-[#2A2333]/60 bg-[#1E1826]/50 opacity-60'
                }`}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2"
                  style={{ borderColor: iconColor, color: iconColor }}
                >
                  <StatusIcon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-manrope text-[11px] uppercase tracking-[0.14em] text-[#75708A]">
                    Birama {quest.level}
                  </p>
                  <p className="truncate font-fraunces text-lg text-[#F3EEE2]">{quest.title}</p>
                  {quest.description && (
                    <p className="mt-0.5 truncate font-manrope text-xs text-[#75708A]">
                      {quest.description}
                    </p>
                  )}
                </div>
                <span className="shrink-0 font-mono text-xs text-[#D9A441]">+{quest.xp_reward} XP</span>
              </div>
            );

            return (
              <li key={quest.main_quests_id}>
                {unlocked ? <Link href={`/main-quests/${quest.main_quests_id}`}>{Card}</Link> : Card}
              </li>
            );
          })}
        </ol>
      )}
    </AppLayout>
  );
}
