import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Plus, Trash2, Music2 } from 'lucide-react';

interface Instrument {
  intruments_id: number;
  name: string;
  difficulty?: string;
}
interface Category {
  music_categories_id: number;
  name: string;
  description?: string;
  instruments: Instrument[];
  instruments_count: number;
  communities_count: number;
}

function AddInstrumentRow({ categoryId }: { categoryId: number }) {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');

  const submit = () => {
    if (!name.trim()) return;
    router.post(
      `/admin/categories/${categoryId}/instruments`,
      { name, difficulty },
      { preserveScroll: true, onSuccess: () => setName('') },
    );
  };

  return (
    <div className="mt-2 flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="Nama instrument baru"
        className="flex-1 rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-1.5 font-manrope text-xs text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
      />
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="rounded-lg border border-[#2A2333] bg-[#14101B] px-2 py-1.5 font-manrope text-xs text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <button
        onClick={submit}
        className="flex items-center gap-1 rounded-lg bg-[#D9A441] px-3 py-1.5 font-manrope text-xs text-[#14101B]"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

export default function Categories({ categories }: { categories: Category[] }) {
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const submitCategory = () => {
    if (!newName.trim()) return;
    router.post(
      '/admin/categories',
      { name: newName, description: newDescription },
      {
        preserveScroll: true,
        onSuccess: () => {
          setNewName('');
          setNewDescription('');
        },
      },
    );
  };

  const deleteCategory = (category: Category) => {
    if (!confirm(`Hapus kategori ${category.name}?`)) return;
    router.delete(`/admin/categories/${category.music_categories_id}`, { preserveScroll: true });
  };

  const deleteInstrument = (instrument: Instrument) => {
    if (!confirm(`Hapus instrument ${instrument.name}?`)) return;
    router.delete(`/admin/instruments/${instrument.intruments_id}`, { preserveScroll: true });
  };

  return (
    <AppLayout title="Kategori Alat Musik" role="Admin">
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">Admin</p>
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <Music2 size={24} className="text-[#D9A441]" /> Kategori Alat Musik
        </h1>
      </header>

      {/* Form kategori baru */}
      <section className="mt-6 flex flex-col gap-2 rounded-xl border border-[#2A2333] bg-[#1E1826] p-5 sm:flex-row">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nama kategori (mis. Gitar)"
          className="flex-1 rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
        />
        <input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Deskripsi singkat (opsional)"
          className="flex-1 rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
        />
        <button
          onClick={submitCategory}
          className="flex items-center justify-center gap-1.5 rounded-full bg-[#D9A441] px-5 py-2 font-manrope text-sm text-[#14101B]"
        >
          <Plus size={14} /> Tambah Kategori
        </button>
      </section>

      {/* List kategori */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <div key={category.music_categories_id} className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-fraunces text-lg text-[#F3EEE2]">{category.name}</p>
                {category.description && (
                  <p className="mt-0.5 font-manrope text-xs text-[#75708A]">{category.description}</p>
                )}
                <p className="mt-1 font-manrope text-[11px] text-[#75708A]">
                  {category.instruments_count} instrument · {category.communities_count} komunitas
                </p>
              </div>
              <button
                onClick={() => deleteCategory(category)}
                className="shrink-0 text-[#75708A] hover:text-[#C1443C]"
                title="Hapus kategori"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {category.instruments.map((instrument) => (
                <span
                  key={instrument.intruments_id}
                  className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 font-manrope text-[11px] text-[#B7AFC2]"
                >
                  {instrument.name}
                  <button onClick={() => deleteInstrument(instrument)} className="text-[#75708A] hover:text-[#C1443C]">
                    <Trash2 size={10} />
                  </button>
                </span>
              ))}
            </div>

            <AddInstrumentRow categoryId={category.music_categories_id} />
          </div>
        ))}
      </section>
    </AppLayout>
  );
}
