import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { apiFetch, ApiError } from '@/lib/api';
import { ArrowLeft, Video, Loader2 } from 'lucide-react';

interface Material {
  materials_id: number;
  title: string;
  main_quest: { main_quests_id: number; community: { community_name: string } };
}

export default function PracticeCreate({ material }: { material: Material }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minimumScore, setMinimumScore] = useState(70);
  const [xpReward, setXpReward] = useState(100);
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/api/materials/${material.materials_id}/practices`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          minimum_score: minimumScore,
          xp_reward: xpReward,
          deadline: deadline || null,
          status: 'Active',
        }),
      });
      router.visit(`/main-quests/${material.main_quest.main_quests_id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal membuat practice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Tambah Practice"
      role="Member"
      communityRole="Ketua"
      communityName={material.main_quest.community.community_name}
    >
      <Link
        href={`/main-quests/${material.main_quest.main_quests_id}`}
        className="flex items-center gap-1.5 font-manrope text-xs text-[#75708A] hover:text-[#F3EEE2]"
      >
        <ArrowLeft size={14} /> Kembali
      </Link>

      <header className="mt-3">
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <Video size={24} className="text-[#C1443C]" /> Practice Baru
        </h1>
        <p className="mt-1 font-manrope text-sm text-[#75708A]">untuk materi {material.title}</p>
      </header>

      <div className="mt-6 max-w-lg space-y-4">
        <div>
          <label className="font-manrope text-xs text-[#75708A]">Judul</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="font-manrope text-xs text-[#75708A]">Deskripsi / Instruksi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-manrope text-xs text-[#75708A]">Skor Minimum Lulus</label>
            <input
              type="number"
              value={minimumScore}
              onChange={(e) => setMinimumScore(Number(e.target.value))}
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
        </div>
        <div>
          <label className="font-manrope text-xs text-[#75708A]">Deadline (opsional)</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
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
    </AppLayout>
  );
}
