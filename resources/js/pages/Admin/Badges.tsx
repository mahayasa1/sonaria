import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { BadgeCheck, Plus, Trash2 } from 'lucide-react';

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

  const destroy = (badge: Badge) => {
    if (!confirm(`Hapus badge "${badge.badge_name}"?`)) return;
    router.delete(`/admin/badges/${badge.badges_id}`, { preserveScroll: true });
  };

  return (
    <AppLayout title="Kelola Badge" role="Admin">
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">Admin</p>
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <BadgeCheck size={24} className="text-[#D9A441]" /> Badge
        </h1>
      </header>

      <section className="mt-6 grid gap-2 rounded-xl border border-[#2A2333] bg-[#1E1826] p-5 sm:grid-cols-[1fr_2fr_140px_auto]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama badge"
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
          value={xpRequired}
          onChange={(e) => setXpRequired(Number(e.target.value))}
          placeholder="XP dibutuhkan"
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
        {badges.map((b) => (
          <div key={b.badges_id} className="flex items-center justify-between px-5 py-3.5">
            <div>
              <p className="font-manrope text-sm text-[#F3EEE2]">{b.badge_name}</p>
              {b.description && <p className="font-manrope text-xs text-[#75708A]">{b.description}</p>}
              <p className="mt-0.5 font-manrope text-[11px] text-[#75708A]">
                Dimiliki {b.user_badges_count} user
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!!b.xp_required && <span className="font-mono text-xs text-[#D9A441]">{b.xp_required} XP</span>}
              <button onClick={() => destroy(b)} className="text-[#75708A] hover:text-[#C1443C]">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </section>
    </AppLayout>
  );
}
