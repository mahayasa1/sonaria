import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Plus, Pencil, Trash2, Music2, X } from 'lucide-react';

interface Instrument {
  intruments_id: number;
  name: string;
  description?: string;
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
        className="flex-1 rounded-lg border border-[#312E81] bg-[#020617] px-3 py-1.5 font-manrope text-xs text-[#EDE9FE] placeholder:text-[#8D89B0] focus:border-[#8B5CF6]/50 focus:outline-none"
      />
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="rounded-lg border border-[#312E81] bg-[#020617] px-2 py-1.5 font-manrope text-xs text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <button
        onClick={submit}
        className="flex items-center gap-1 rounded-lg bg-[#8B5CF6] px-3 py-1.5 font-manrope text-xs text-[#020617]"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

export default function Categories({ categories }: { categories: Category[] }) {
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [savingCategory, setSavingCategory] = useState(false);

  const [editingInstrument, setEditingInstrument] = useState<Instrument | null>(null);
  const [instrumentForm, setInstrumentForm] = useState({ name: '', description: '', difficulty: 'Easy' });
  const [savingInstrument, setSavingInstrument] = useState(false);

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

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description ?? '' });
  };

  const submitEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setSavingCategory(true);
    router.put(`/admin/categories/${editingCategory.music_categories_id}`, categoryForm, {
      preserveScroll: true,
      onSuccess: () => setEditingCategory(null),
      onFinish: () => setSavingCategory(false),
    });
  };

  const deleteInstrument = (instrument: Instrument) => {
    if (!confirm(`Hapus instrument ${instrument.name}?`)) return;
    router.delete(`/admin/instruments/${instrument.intruments_id}`, { preserveScroll: true });
  };

  const openEditInstrument = (instrument: Instrument) => {
    setEditingInstrument(instrument);
    setInstrumentForm({
      name: instrument.name,
      description: instrument.description ?? '',
      difficulty: instrument.difficulty ?? 'Easy',
    });
  };

  const submitEditInstrument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInstrument) return;
    setSavingInstrument(true);
    router.put(`/admin/instruments/${editingInstrument.intruments_id}`, instrumentForm, {
      preserveScroll: true,
      onSuccess: () => setEditingInstrument(null),
      onFinish: () => setSavingInstrument(false),
    });
  };

  return (
    <AppLayout title="Kategori Alat Musik" role="Admin">
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#8D89B0]">Admin</p>
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#EDE9FE]">
          <Music2 size={24} className="text-[#8B5CF6]" /> Kategori Alat Musik
        </h1>
      </header>

      {/* Form kategori baru */}
      <section className="mt-6 flex flex-col gap-2 rounded-xl border border-[#312E81] bg-[#0A1128] p-5 sm:flex-row">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nama kategori (mis. Gitar)"
          className="flex-1 rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] placeholder:text-[#8D89B0] focus:border-[#8B5CF6]/50 focus:outline-none"
        />
        <input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Deskripsi singkat (opsional)"
          className="flex-1 rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] placeholder:text-[#8D89B0] focus:border-[#8B5CF6]/50 focus:outline-none"
        />
        <button
          onClick={submitCategory}
          className="flex items-center justify-center gap-1.5 rounded-full bg-[#8B5CF6] px-5 py-2 font-manrope text-sm text-[#020617]"
        >
          <Plus size={14} /> Tambah Kategori
        </button>
      </section>

      {/* List kategori */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <div key={category.music_categories_id} className="rounded-xl border border-[#312E81] bg-[#0A1128] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-fraunces text-lg text-[#EDE9FE]">{category.name}</p>
                {category.description && (
                  <p className="mt-0.5 font-manrope text-xs text-[#8D89B0]">{category.description}</p>
                )}
                <p className="mt-1 font-manrope text-[11px] text-[#8D89B0]">
                  {category.instruments_count} instrument · {category.communities_count} komunitas
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => openEditCategory(category)}
                  className="text-[#8D89B0] hover:text-[#EDE9FE]"
                  title="Edit kategori"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => deleteCategory(category)}
                  className="text-[#8D89B0] hover:text-[#F87171]"
                  title="Hapus kategori"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {category.instruments.map((instrument) => (
                <span
                  key={instrument.intruments_id}
                  className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 font-manrope text-[11px] text-[#DDD6FE]"
                >
                  {instrument.name}
                  <button
                    onClick={() => openEditInstrument(instrument)}
                    className="text-[#8D89B0] hover:text-[#EDE9FE]"
                    title="Edit instrument"
                  >
                    <Pencil size={10} />
                  </button>
                  <button onClick={() => deleteInstrument(instrument)} className="text-[#8D89B0] hover:text-[#F87171]">
                    <Trash2 size={10} />
                  </button>
                </span>
              ))}
            </div>

            <AddInstrumentRow categoryId={category.music_categories_id} />
          </div>
        ))}
      </section>

      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-xl border border-[#312E81] bg-[#0A1128] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-fraunces text-xl text-[#EDE9FE]">Edit Kategori</h2>
              <button onClick={() => setEditingCategory(null)} className="text-[#8D89B0] hover:text-[#EDE9FE]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submitEditCategory} className="mt-5 space-y-4">
              <div>
                <label className="font-manrope text-xs text-[#8D89B0]">Nama Kategori</label>
                <input
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-manrope text-xs text-[#8D89B0]">Deskripsi</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="rounded-full bg-white/5 px-4 py-2 font-manrope text-xs text-[#DDD6FE] hover:bg-white/10"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="rounded-full bg-[#8B5CF6] px-4 py-2 font-manrope text-xs text-[#020617] disabled:opacity-50"
                >
                  {savingCategory ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingInstrument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-xl border border-[#312E81] bg-[#0A1128] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-fraunces text-xl text-[#EDE9FE]">Edit Instrument</h2>
              <button onClick={() => setEditingInstrument(null)} className="text-[#8D89B0] hover:text-[#EDE9FE]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submitEditInstrument} className="mt-5 space-y-4">
              <div>
                <label className="font-manrope text-xs text-[#8D89B0]">Nama Instrument</label>
                <input
                  value={instrumentForm.name}
                  onChange={(e) => setInstrumentForm({ ...instrumentForm, name: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-manrope text-xs text-[#8D89B0]">Deskripsi</label>
                <textarea
                  value={instrumentForm.description}
                  onChange={(e) => setInstrumentForm({ ...instrumentForm, description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-manrope text-xs text-[#8D89B0]">Tingkat Kesulitan</label>
                <select
                  value={instrumentForm.difficulty}
                  onChange={(e) => setInstrumentForm({ ...instrumentForm, difficulty: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingInstrument(null)}
                  className="rounded-full bg-white/5 px-4 py-2 font-manrope text-xs text-[#DDD6FE] hover:bg-white/10"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingInstrument}
                  className="rounded-full bg-[#8B5CF6] px-4 py-2 font-manrope text-xs text-[#020617] disabled:opacity-50"
                >
                  {savingInstrument ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
