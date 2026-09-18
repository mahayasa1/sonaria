import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Award, Plus, Pencil, Trash2, X } from 'lucide-react';

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

  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', xp_reward: 0 });
  const [saving, setSaving] = useState(false);

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

  const openEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setEditForm({
      title: achievement.title,
      description: achievement.description ?? '',
      xp_reward: achievement.xp_reward,
    });
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAchievement) return;
    setSaving(true);
    router.put(`/admin/achievements/${editingAchievement.achievements_id}`, editForm, {
      preserveScroll: true,
      onSuccess: () => setEditingAchievement(null),
      onFinish: () => setSaving(false),
    });
  };

  const destroy = (achievement: Achievement) => {
    if (!confirm(`Hapus achievement "${achievement.title}"?`)) return;
    router.delete(`/admin/achievements/${achievement.achievements_id}`, { preserveScroll: true });
  };

  return (
    <AppLayout title="Kelola Achievement" role="Admin">
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#8D89B0]">Admin</p>
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#EDE9FE]">
          <Award size={24} className="text-[#8B5CF6]" /> Achievement
        </h1>
      </header>

      <section className="mt-6 grid gap-2 rounded-xl border border-[#312E81] bg-[#0A1128] p-5 sm:grid-cols-[1fr_2fr_120px_auto]">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul achievement"
          className="rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] placeholder:text-[#8D89B0] focus:border-[#8B5CF6]/50 focus:outline-none"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi"
          className="rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] placeholder:text-[#8D89B0] focus:border-[#8B5CF6]/50 focus:outline-none"
        />
        <input
          type="number"
          value={xpReward}
          onChange={(e) => setXpReward(Number(e.target.value))}
          placeholder="XP"
          className="rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
        />
        <button
          onClick={submit}
          className="flex items-center justify-center gap-1.5 rounded-full bg-[#8B5CF6] px-5 py-2 font-manrope text-sm text-[#020617]"
        >
          <Plus size={14} /> Tambah
        </button>
      </section>

      <section className="mt-6 divide-y divide-[#312E81] overflow-hidden rounded-xl border border-[#312E81] bg-[#0A1128]">
        {achievements.map((a) => (
          <div key={a.achievements_id} className="flex items-center justify-between px-5 py-3.5">
            <div>
              <p className="font-manrope text-sm text-[#EDE9FE]">{a.title}</p>
              {a.description && <p className="font-manrope text-xs text-[#8D89B0]">{a.description}</p>}
              <p className="mt-0.5 font-manrope text-[11px] text-[#8D89B0]">
                Diraih {a.user_achievements_count} user
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-[#8B5CF6]">+{a.xp_reward} XP</span>
              <button
                onClick={() => openEdit(a)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-manrope text-xs text-[#DDD6FE] hover:bg-white/10"
              >
                <Pencil size={13} />
                Edit
              </button>
              <button onClick={() => destroy(a)} className="text-[#8D89B0] hover:text-[#F87171]">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </section>

      {editingAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-xl border border-[#312E81] bg-[#0A1128] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-fraunces text-xl text-[#EDE9FE]">Edit Achievement</h2>
              <button onClick={() => setEditingAchievement(null)} className="text-[#8D89B0] hover:text-[#EDE9FE]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submitEdit} className="mt-5 space-y-4">
              <div>
                <label className="font-manrope text-xs text-[#8D89B0]">Judul</label>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-manrope text-xs text-[#8D89B0]">Deskripsi</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-manrope text-xs text-[#8D89B0]">XP Reward</label>
                <input
                  type="number"
                  value={editForm.xp_reward}
                  onChange={(e) => setEditForm({ ...editForm, xp_reward: Number(e.target.value) })}
                  required
                  className="mt-1 w-full rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAchievement(null)}
                  className="rounded-full bg-white/5 px-4 py-2 font-manrope text-xs text-[#DDD6FE] hover:bg-white/10"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[#8B5CF6] px-4 py-2 font-manrope text-xs text-[#020617] disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
