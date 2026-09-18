import React from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import EmptyState from '@/components/EmptyState';
import { Trophy, Crown, Medal } from 'lucide-react';

interface Entry {
  leaderboards_id: number;
  rank: number;
  total_xp: number;
  total_point: number;
  user: { users_id: number; name: string; username: string };
}

const PODIUM_COLOR: Record<number, string> = {
  1: '#8B5CF6',
  2: '#DDD6FE',
  3: '#F87171',
};

export default function Index({
  community,
  leaderboard,
  period,
  myUserId,
}: {
  community: { community_name: string };
  leaderboard: Entry[];
  period: string;
  myUserId: number;
}) {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <AppLayout title="Leaderboard" role="Member" communityName={community.community_name}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#8D89B0]">
            {community.community_name}
          </p>
          <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#EDE9FE]">
            <Trophy size={24} className="text-[#8B5CF6]" /> Leaderboard
          </h1>
        </div>
        <div className="flex gap-2">
          {['Weekly', 'Monthly', 'All Time'].map((p) => (
            <button
              key={p}
              onClick={() => router.get('/leaderboard', { period: p }, { preserveState: true })}
              className={`rounded-full border px-4 py-1.5 font-manrope text-xs ${
                period === p
                  ? 'border-[#8B5CF6] bg-[#8B5CF6]/12 text-[#8B5CF6]'
                  : 'border-[#312E81] text-[#DDD6FE]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </header>

      {leaderboard.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Trophy}
            title="Leaderboard belum tersedia"
            description="Selesaikan quest, misi, dan challenge untuk mulai bersaing di peringkat."
          />
        </div>
      ) : (
        <>
          {/* Top 3 spesial */}
          <section className="mt-8 grid items-end gap-4 sm:grid-cols-3">
            {[top3[1], top3[0], top3[2]].map((entry, i) =>
              entry ? (
                <div
                  key={entry.leaderboards_id}
                  className="rounded-xl border p-5 text-center"
                  style={{
                    borderColor: `${PODIUM_COLOR[entry.rank]}40`,
                    backgroundColor: `${PODIUM_COLOR[entry.rank]}10`,
                    marginTop: i === 1 ? 0 : '1.5rem',
                  }}
                >
                  <Crown
                    size={entry.rank === 1 ? 26 : 20}
                    className="mx-auto"
                    style={{ color: PODIUM_COLOR[entry.rank] }}
                  />
                  <p className="mt-2 font-fraunces text-lg text-[#EDE9FE]">{entry.user.name}</p>
                  <p className="font-manrope text-xs text-[#8D89B0]">@{entry.user.username}</p>
                  <p className="mt-2 font-mono text-sm" style={{ color: PODIUM_COLOR[entry.rank] }}>
                    {entry.total_xp} XP
                  </p>
                </div>
              ) : (
                <div key={`empty-${i}`} />
              ),
            )}
          </section>

          {/* Sisanya sebagai tabel */}
          {rest.length > 0 && (
            <section className="mt-6 divide-y divide-[#312E81] rounded-xl border border-[#312E81] bg-[#0A1128]">
              {rest.map((entry) => (
                <div
                  key={entry.leaderboards_id}
                  className={`flex items-center gap-4 px-5 py-3.5 ${
                    entry.user.users_id === myUserId ? 'bg-[#8B5CF6]/8' : ''
                  }`}
                >
                  <span className="w-6 shrink-0 font-mono text-sm text-[#8D89B0]">#{entry.rank}</span>
                  <Medal size={16} className="shrink-0 text-[#8D89B0]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-manrope text-sm text-[#EDE9FE]">{entry.user.name}</p>
                    <p className="truncate font-manrope text-xs text-[#8D89B0]">@{entry.user.username}</p>
                  </div>
                  <span className="shrink-0 font-mono text-sm text-[#8B5CF6]">{entry.total_xp} XP</span>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </AppLayout>
  );
}
