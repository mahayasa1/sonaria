import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { apiFetch, ApiError } from '@/lib/api';
import { ArrowLeft, Swords, Loader2 } from 'lucide-react';

export default function MainQuestCreate({
  community,
  existingLevels,
}: {
  community: { communities_id: number; community_name: string };
  existingLevels: number[];
}) {
  const [level, setLevel] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableLevels = Array.from({ length: 7 }, (_, i) => i + 1).filter(
    (l) => !existingLevels.includes(l),
  );

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const quest = await apiFetch<{ main_quests_id: number }>(`/api/communities/${community.communities_id}/main-quests`, {
        method: 'POST',
        body: JSON.stringify({ level, title, description, xp_reward: xpReward }),
      });
      router.visit(`/main-quests/${quest.main_quests_id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal membuat Main Quest.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Buat Main Quest" role="Member" communityRole="Ketua" communityName={community.community_name}>
      <Link href="/dashboard" className="flex items-center gap-1.5 font-manrope text-xs text-[#75708A] hover:text-[#F3EEE2]">
        <ArrowLeft size={14} /> Kembali
      </Link>

      <header className="mt-3">
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <Swords size={24} className="text-[#D9A441]" /> Main Quest Baru
        </h1>
      </header>

      {availableLevels.length === 0 ? (
        <p className="mt-6 font-manrope text-sm text-[#B7AFC2]">
          Semua 7 birama Main Quest sudah dibuat untuk komunitas ini.
        </p>
      ) : (
        <div className="mt-6 max-w-lg space-y-4">
          <div>
            <label className="font-manrope text-xs text-[#75708A]">Birama (Level)</label>
            <select
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
            >
              {availableLevels.map((l) => (
                <option key={l} value={l}>
                  Level {l}
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

          <button
            onClick={submit}
            disabled={loading || !title}
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
