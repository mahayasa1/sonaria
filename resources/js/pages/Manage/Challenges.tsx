import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import EmptyState from '@/components/EmptyState';
import { apiFetch, ApiError } from '@/lib/api';
import { Trophy, Plus, Loader2, Lock } from 'lucide-react';

interface ChallengeItem {
  challenges_id: number;
  title: string;
  description?: string;
  xp_reward: string;
  point_reward: string;
  start_date: string;
  end_date: string;
  status: 'Draft' | 'Active' | 'Closed';
  instrument?: { name: string };
  submissions_count: number;
}

const STATUS_STYLE: Record<ChallengeItem['status'], string> = {
  Active: 'border-[#4C8C86]/40 bg-[#4C8C86]/12 text-[#4C8C86]',
  Draft: 'border-[#D9A441]/40 bg-[#D9A441]/12 text-[#D9A441]',
  Closed: 'border-[#75708A]/40 bg-white/5 text-[#75708A]',
};

function ChallengeRow({
  challenge,
  canManage,
  onClosed,
}: {
  challenge: ChallengeItem;
  canManage: boolean;
  onClosed: (id: number) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = async () => {
    if (!confirm(`Tutup challenge "${challenge.title}"? Komunitas baru bisa buat challenge baru setelah ini.`)) return;
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/api/challenges/${challenge.challenges_id}/close`, { method: 'POST' });
      onClosed(challenge.challenges_id);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal menutup challenge.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 font-manrope text-[10px] ${STATUS_STYLE[challenge.status]}`}>
              {challenge.status}
            </span>
            {challenge.instrument && (
              <span className="font-manrope text-xs text-[#75708A]">{challenge.instrument.name}</span>
            )}
          </div>
          <p className="mt-1.5 font-fraunces text-lg text-[#F3EEE2]">{challenge.title}</p>
          {challenge.description && (
            <p className="mt-1 font-manrope text-sm text-[#B7AFC2]">{challenge.description}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-4 font-manrope text-xs text-[#75708A]">
            <span>+{challenge.xp_reward} XP</span>
            <span>{challenge.submissions_count} submission</span>
            <span>
              {new Date(challenge.start_date).toLocaleDateString('id-ID')} –{' '}
              {new Date(challenge.end_date).toLocaleDateString('id-ID')}
            </span>
          </div>
          {error && <p className="mt-2 font-manrope text-xs text-[#C1443C]">{error}</p>}
        </div>

        {canManage && challenge.status === 'Active' && (
          <button
            onClick={close}
            disabled={loading}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#C1443C]/40 px-3.5 py-1.5 font-manrope text-xs text-[#C1443C] disabled:opacity-50"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />}
            Tutup Challenge
          </button>
        )}
      </div>
    </div>
  );
}

export default function Challenges({
  community,
  challenges,
  canManage,
  communityRole,
}: {
  community: { communities_id: number; community_name: string };
  challenges: ChallengeItem[];
  canManage: boolean;
  communityRole?: string | null;
}) {
  const [list, setList] = useState(challenges);
  const hasActive = list.some((c) => c.status === 'Active');

  return (
    <AppLayout title="Kelola Challenge" role="Member" communityRole={communityRole} communityName={community.community_name}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
            {community.community_name}
          </p>
          <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
            <Trophy size={24} className="text-[#D9A441]" /> Kelola Challenge
          </h1>
        </div>
        {canManage && !hasActive && (
          <Link
            href="/manage/challenge/create"
            className="flex items-center gap-1.5 rounded-full bg-[#D9A441] px-4 py-2.5 font-manrope text-sm text-[#14101B]"
          >
            <Plus size={15} /> Challenge Baru
          </Link>
        )}
      </header>

      {list.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={Trophy} title="Belum ada challenge" description="Buat challenge pertama untuk komunitas ini." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {list.map((c) => (
            <ChallengeRow
              key={c.challenges_id}
              challenge={c}
              canManage={canManage}
              onClosed={(id) =>
                setList((prev) => prev.map((x) => (x.challenges_id === id ? { ...x, status: 'Closed' } : x)))
              }
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
