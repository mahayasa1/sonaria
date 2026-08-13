import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import EmptyState from '@/components/EmptyState';
import { apiFetch, ApiError } from '@/lib/api';
import { Flame, Plus, Loader2, Power } from 'lucide-react';

interface Mission {
  daily_missions_id: number;
  title: string;
  description?: string;
  mission_number: string;
  xp_reward_min: string;
  xp_reward_max: string;
  start_date: string;
  end_date: string;
  status: 'Draft' | 'Active' | 'Inactive';
  passing_score?: string;
  questions_count?: number;
}

const STATUS_STYLE: Record<Mission['status'], string> = {
  Active: 'border-[#4C8C86]/40 bg-[#4C8C86]/12 text-[#4C8C86]',
  Draft: 'border-[#D9A441]/40 bg-[#D9A441]/12 text-[#D9A441]',
  Inactive: 'border-[#75708A]/40 bg-white/5 text-[#75708A]',
};

function MissionRow({
  mission,
  canManage,
  onDeactivated,
}: {
  mission: Mission;
  canManage: boolean;
  onDeactivated: (id: number) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deactivate = async () => {
    if (!confirm(`Nonaktifkan daily mission "${mission.title}"?`)) return;
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/api/daily-missions/${mission.daily_missions_id}/deactivate`, { method: 'POST' });
      onDeactivated(mission.daily_missions_id);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal menonaktifkan mission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 font-manrope text-[10px] ${STATUS_STYLE[mission.status]}`}>
              {mission.status}
            </span>
            <span className="font-manrope text-xs text-[#75708A]">Slot #{mission.mission_number}</span>
          </div>
          <p className="mt-1.5 font-fraunces text-lg text-[#F3EEE2]">{mission.title}</p>
          {mission.description && (
            <p className="mt-1 font-manrope text-sm text-[#B7AFC2]">{mission.description}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-4 font-manrope text-xs text-[#75708A]">
            {typeof mission.questions_count === 'number' && (
              <span>{mission.questions_count} soal</span>
            )}
            <span>
              +{mission.xp_reward_min}–{mission.xp_reward_max} XP
            </span>
            <span>
              {new Date(mission.start_date).toLocaleDateString('id-ID')} –{' '}
              {new Date(mission.end_date).toLocaleDateString('id-ID')}
            </span>
          </div>
          {error && <p className="mt-2 font-manrope text-xs text-[#C1443C]">{error}</p>}
        </div>

        {canManage && mission.status === 'Active' && (
          <button
            onClick={deactivate}
            disabled={loading}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#C1443C]/40 px-3.5 py-1.5 font-manrope text-xs text-[#C1443C] disabled:opacity-50"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Power size={12} />}
            Nonaktifkan
          </button>
        )}
      </div>
    </div>
  );
}

export default function DailyMissions({
  community,
  missions,
  canManage,
  communityRole,
}: {
  community: { communities_id: number; community_name: string };
  missions: Mission[];
  canManage: boolean;
  communityRole?: string | null;
}) {
  const [list, setList] = useState(missions);
  const activeCount = list.filter((m) => m.status === 'Active').length;

  return (
    <AppLayout title="Kelola Daily Mission" role="Member" communityRole={communityRole} communityName={community.community_name}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
            {community.community_name}
          </p>
          <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
            <Flame size={24} className="text-[#C1443C]" /> Kelola Daily Mission
          </h1>
          <p className="mt-1 font-manrope text-xs text-[#75708A]">{activeCount} / 6 slot aktif</p>
        </div>
        {canManage && activeCount < 6 && (
          <Link
            href="/manage/daily-missions/create"
            className="flex items-center gap-1.5 rounded-full bg-[#D9A441] px-4 py-2.5 font-manrope text-sm text-[#14101B]"
          >
            <Plus size={15} /> Daily Mission Baru
          </Link>
        )}
      </header>

      {list.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={Flame} title="Belum ada daily mission" description="Buat daily mission pertama untuk komunitas ini." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {list.map((m) => (
            <MissionRow
              key={m.daily_missions_id}
              mission={m}
              canManage={canManage}
              onDeactivated={(id) =>
                setList((prev) => prev.map((x) => (x.daily_missions_id === id ? { ...x, status: 'Inactive' } : x)))
              }
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
