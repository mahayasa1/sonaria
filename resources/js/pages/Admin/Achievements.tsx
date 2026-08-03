import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Award, Plus, Trash2 } from 'lucide-react';

interface Achievement {
  achievements_id: number;
  title: string;
  description?: string;
  xp_reward: number;
  point_reward?: number;
  user_achievements_count: number;
}

export default function Achievements({ achievements }: { achievements: Achievement[] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState(50);

  const submit = () => {
    if (!title.trim()) return;
    router.post(
      '/admin/achievements',
      { title, description, xp_reward: xpReward },
      {
        preserveScroll: true,
        onSuccess: () => {
          setTitle('');
          setDescription('');
        },
      },
    );
  };

  const destroy = (achievement: Achievement) => {
    if (!confirm(`Hapus achievement "${achievement.title}"?`)) return;
    router.delete(`/admin/achievements/${achievement.achievements_id}`, { preserveScroll: true });
  };

  return (
    <AppLayout title="Kelola Achievement" role="Admin">
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">Admin</p>
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <Award size={24} className="text-[#D9A441]" /> Achievement
        </h1>
      </header>

      <section className="mt-6 grid gap-2 rounded-xl border border-[#2A2333] bg-[#1E1826] p-5 sm:grid-cols-[1fr_2fr_120px_auto]">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul achievement"
          className="rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi"
          className="rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
        />
        <input
          type="number"
          value={xpReward}
          onChange={(e) => setXpReward(Number(e.target.value))}
          placeholder="XP"
          className="rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
        />
        <button
          onClick={submit}
          className="flex items-center justify-center gap-1.5 rounded-full bg-[#D9A441] px-5 py-2 font-manrope text-sm text-[#14101B]"
        >
          <Plus size={14} /> Tambah
        </button>
      </section>

      <section className="mt-6 divide-y divide-[#2A2333] overflow-hidden rounded-xl border border-[#2A2333] bg-[#1E1826]">
        {achievements.map((a) => (
          <div key={a.achievements_id} className="flex items-center justify-between px-5 py-3.5">
            <div>
              <p className="font-manrope text-sm text-[#F3EEE2]">{a.title}</p>
              {a.description && <p className="font-manrope text-xs text-[#75708A]">{a.description}</p>}
              <p className="mt-0.5 font-manrope text-[11px] text-[#75708A]">
                Diraih {a.user_achievements_count} user
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-[#D9A441]">+{a.xp_reward} XP</span>
              <button onClick={() => destroy(a)} className="text-[#75708A] hover:text-[#C1443C]">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </section>
    </AppLayout>
  );
}
