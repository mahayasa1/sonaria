import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Search, Ban, CheckCircle2, Pencil, Trash2, X } from 'lucide-react';

interface CommunityRow {
  communities_id: number;
  community_name: string;
  description?: string | null;
  total_member: number;
  status: string;
  category?: { music_categories_id: number; name: string };
  owner?: { name: string };
}
interface CategoryOption {
  music_categories_id: number;
  name: string;
}
interface Paginated<T> {
  data: T[];
  links: { url: string | null; label: string; active: boolean }[];
}

export default function Communities({
  communities,
  categories,
  filters,
}: {
  communities: Paginated<CommunityRow>;
  categories: CategoryOption[];
  filters: { search?: string };
}) {
  const [search, setSearch] = useState(filters.search ?? '');
  const [editingCommunity, setEditingCommunity] = useState<CommunityRow | null>(null);
  const [editForm, setEditForm] = useState({
    community_name: '',
    description: '',
    music_category_id: '' as number | '',
  });
  const [saving, setSaving] = useState(false);

  const toggleStatus = (community: CommunityRow) => {
    if (!confirm(`${community.status === 'Active' ? 'Nonaktifkan' : 'Aktifkan'} komunitas ${community.community_name}?`))
      return;
    router.post(`/admin/communities/${community.communities_id}/toggle-status`, {}, { preserveScroll: true });
  };

  const openEdit = (community: CommunityRow) => {
    setEditingCommunity(community);
    setEditForm({
      community_name: community.community_name,
      description: community.description ?? '',
      music_category_id: community.category?.music_categories_id ?? '',
    });
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCommunity) return;
    setSaving(true);
    router.put(`/admin/communities/${editingCommunity.communities_id}`, editForm, {
      preserveScroll: true,
      onSuccess: () => setEditingCommunity(null),
      onFinish: () => setSaving(false),
    });
  };

  const deleteCommunity = (community: CommunityRow) => {
    if (!confirm(`Hapus komunitas ${community.community_name}? Tindakan ini tidak bisa dibatalkan.`)) return;
    router.delete(`/admin/communities/${community.communities_id}`, { preserveScroll: true });
  };

  return (
    <AppLayout title="Kelola Komunitas" role="Admin">
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">Admin</p>
        <h1 className="font-fraunces text-3xl text-[#F3EEE2]">Komunitas</h1>
      </header>

      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75708A]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' && router.get('/admin/communities', { search }, { preserveState: true })
          }
          placeholder="Cari nama komunitas..."
          className="w-full rounded-full border border-[#2A2333] bg-[#1E1826] py-2.5 pl-10 pr-4 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
        />
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {communities.data.map((c) => (
          <div key={c.communities_id} className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-fraunces text-lg text-[#F3EEE2]">{c.community_name}</p>
                <p className="font-manrope text-xs text-[#75708A]">
                  {c.category?.name ?? 'Umum'} · dikelola {c.owner?.name ?? '-'}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 font-manrope text-[11px] ${
                  c.status === 'Active' ? 'bg-[#4C8C86]/12 text-[#4C8C86]' : 'bg-[#C1443C]/12 text-[#C1443C]'
                }`}
              >
                {c.status}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs text-[#D9A441]">{c.total_member} anggota</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(c)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-manrope text-xs text-[#B7AFC2] hover:bg-white/10"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  onClick={() => toggleStatus(c)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-manrope text-xs text-[#B7AFC2] hover:bg-white/10"
                >
                  {c.status === 'Active' ? <Ban size={13} /> : <CheckCircle2 size={13} />}
                  {c.status === 'Active' ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button
                  onClick={() => deleteCommunity(c)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#C1443C]/12 px-3 py-1.5 font-manrope text-xs text-[#C1443C] hover:bg-[#C1443C]/20"
                >
                  <Trash2 size={13} />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {communities.links.length > 3 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {communities.links.map((link, i) => (
            <button
              key={i}
              disabled={!link.url}
              onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
              className={`rounded-lg px-3 py-1.5 font-manrope text-xs ${
                link.active ? 'bg-[#D9A441] text-[#14101B]' : 'bg-white/5 text-[#B7AFC2] disabled:opacity-30'
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}

      {editingCommunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-fraunces text-xl text-[#F3EEE2]">Edit Komunitas</h2>
              <button onClick={() => setEditingCommunity(null)} className="text-[#75708A] hover:text-[#F3EEE2]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submitEdit} className="mt-5 space-y-4">
              <div>
                <label className="font-manrope text-xs text-[#75708A]">Nama Komunitas</label>
                <input
                  value={editForm.community_name}
                  onChange={(e) => setEditForm({ ...editForm, community_name: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-manrope text-xs text-[#75708A]">Kategori</label>
                <select
                  value={editForm.music_category_id}
                  onChange={(e) =>
                    setEditForm({ ...editForm, music_category_id: e.target.value ? Number(e.target.value) : '' })
                  }
                  className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
                >
                  <option value="">Umum</option>
                  {categories.map((cat) => (
                    <option key={cat.music_categories_id} value={cat.music_categories_id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-manrope text-xs text-[#75708A]">Deskripsi</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCommunity(null)}
                  className="rounded-full bg-white/5 px-4 py-2 font-manrope text-xs text-[#B7AFC2] hover:bg-white/10"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[#D9A441] px-4 py-2 font-manrope text-xs text-[#14101B] disabled:opacity-50"
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