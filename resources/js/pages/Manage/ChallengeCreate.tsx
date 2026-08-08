import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { apiFetch, ApiError } from '@/lib/api';
import { ArrowLeft, Trophy, Loader2 } from 'lucide-react';

interface Instrument {
  intruments_id: number;
  name: string;
}

export default function ChallengeCreate({
  community,
  instruments,
  hasActiveChallenge,
  communityRole,
}: {
  community: { communities_id: number; community_name: string };
  instruments: Instrument[];
  hasActiveChallenge: boolean;
  communityRole?: string | null;
}) {
  const [instrumentId, setInstrumentId] = useState<number | string>(instruments[0]?.intruments_id ?? '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState(500);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/api/communities/${community.communities_id}/challenges`, {
        method: 'POST',
        body: JSON.stringify({
          instrument_id: Number(instrumentId),
          title,
          description,
          xp_reward: xpReward,
          start_date: startDate,
          end_date: endDate,
        }),
      });
      router.visit('/challenge');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal membuat Challenge.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Buat Challenge" role="Member" communityRole={communityRole} communityName={community.community_name}>
      <Link href="/dashboard" className="flex items-center gap-1.5 font-manrope text-xs text-[#75708A] hover:text-[#F3EEE2]">
        <ArrowLeft size={14} /> Kembali
      </Link>

      <header className="mt-3 flex items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <Trophy size={24} className="text-[#D9A441]" /> Challenge Baru
        </h1>
        <Link
          href="/manage/challenges"
          className="rounded-full border border-[#2A2333] px-4 py-2 font-manrope text-xs text-[#B7AFC2] hover:border-[#D9A441]/40 hover:text-[#D9A441]"
        >
          Kelola Challenge
        </Link>
      </header>

      {hasActiveChallenge ? (
        <p className="mt-6 font-manrope text-sm text-[#B7AFC2]">
          Komunitas ini sudah punya challenge yang sedang aktif. Tutup dulu di{' '}
          <Link href="/manage/challenges" className="text-[#D9A441] underline">
            halaman Kelola Challenge
          </Link>{' '}
          sebelum membuat yang baru.
        </p>
      ) : (
        <div className="mt-6 max-w-lg space-y-4">
          <div>
            <label className="font-manrope text-xs text-[#75708A]">Instrument</label>
            <select
              value={instrumentId}
              onChange={(e) => setInstrumentId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
            >
              {instruments.map((i) => (
                <option key={i.intruments_id} value={i.intruments_id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-manrope text-xs text-[#75708A]">Judul</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-manrope text-xs text-[#75708A]">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-manrope text-xs text-[#75708A]">Reward XP</label>
            <input
              type="number"
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-manrope text-xs text-[#75708A]">Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-manrope text-xs text-[#75708A]">Selesai</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={submit}
            disabled={loading || !title || !instrumentId}
            className="flex items-center gap-2 rounded-full bg-[#D9A441] px-6 py-2.5 font-manrope text-sm text-[#14101B] disabled:opacity-40"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Simpan
          </button>
          {error && <p className="font-manrope text-xs text-[#C1443C]">{error}</p>}
        </div>
      )}
    </AppLayout>
  );
}
