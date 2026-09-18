import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { BadgeCheck, Plus, Pencil, Trash2, X } from 'lucide-react';

interface Badge {
  badges_id: number;
  badge_name: string;
  description?: string;
  xp_required?: number;
  point_required?: number;
  user_badges_count: number;
}

export default function Badges({ badges }: { badges: Badge[] }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [xpRequired, setXpRequired] = useState(0);

  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [editForm, setEditForm] = useState({ badge_name: '', description: '', xp_required: 0 });
  const [saving, setSaving] = useState(false);

  const submit = () => {
    if (!name.trim()) return;
    router.post(
      '/admin/badges',
      { badge_name: name, description, xp_required: xpRequired },
      {
        preserveScroll: true,
        onSuccess: () => {
          setName('');
          setDescription('');
        },
      },
    );
  };

  const openEdit = (badge: Badge) => {
    setEditingBadge(badge);
    setEditForm({
      badge_name: badge.badge_name,
      description: badge.description ?? '',
      xp_required: badge.xp_required ?? 0,
    });
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBadge) return;
    setSaving(true);
    router.put(`/admin/badges/${editingBadge.badges_id}`, editForm, {
      preserveScroll: true,
      onSuccess: () => setEditingBadge(null),
      onFinish: () => setSaving(false),
    });
  };

  const destroy = (badge: Badge) => {
    if (!confirm(`Hapus badge "${badge.badge_name}"?`)) return;
    router.delete(`/admin/badges/${badge.badges_id}`, { preserveScroll: true });
  };

  return (
    <AppLayout title="Kelola Badge" role="Admin">
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#8D89B0]">Admin</p>
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#EDE9FE]">
          <BadgeCheck size={24} className="text-[#8B5CF6]" /> Badge
        </h1>
      </header>

      <section className="mt-6 grid gap-2 rounded-xl border border-[#312E81] bg-[#0A1128] p-5 sm:grid-cols-[1fr_2fr_140px_auto]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama badge"
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
          value={xpRequired}
          onChange={(e) => setXpRequired(Number(e.target.value))}
          placeholder="XP dibutuhkan"
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
        {badges.map((b) => (
          <div key={b.badges_id} className="flex items-center justify-between px-5 py-3.5">
            <div>
              <p className="font-manrope text-sm text-[#EDE9FE]">{b.badge_name}</p>
              {b.description && <p className="font-manrope text-xs text-[#8D89B0]">{b.description}</p>}
              <p className="mt-0.5 font-manrope text-[11px] text-[#8D89B0]">
                Dimiliki {b.user_badges_count} user
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!!b.xp_required && <span className="font-mono text-xs text-[#8B5CF6]">{b.xp_required} XP</span>}
              <button
                onClick={() => openEdit(b)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-manrope text-xs text-[#DDD6FE] hover:bg-white/10"
              >
                <Pencil size={13} />
                Edit
              </button>
              <button onClick={() => destroy(b)} className="text-[#8D89B0] hover:text-[#F87171]">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </section>

      {editingBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-xl border border-[#312E81] bg-[#0A1128] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-fraunces text-xl text-[#EDE9FE]">Edit Badge</h2>
              <button onClick={() => setEditingBadge(null)} className="text-[#8D89B0] hover:text-[#EDE9FE]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submitEdit} className="mt-5 space-y-4">
              <div>
                <label className="font-manrope text-xs text-[#8D89B0]">Nama Badge</label>
                <input
                  value={editForm.badge_name}
                  onChange={(e) => setEditForm({ ...editForm, badge_name: e.target.value })}
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
                <label className="font-manrope text-xs text-[#8D89B0]">XP Dibutuhkan</label>
                <input
                  type="number"
                  value={editForm.xp_required}
                  onChange={(e) => setEditForm({ ...editForm, xp_required: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBadge(null)}
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
