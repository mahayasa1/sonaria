import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Search, ShieldBan, ShieldCheck, Loader2, Pencil, Trash2, X } from 'lucide-react';

interface UserRow {
  users_id: number;
  name: string;
  email: string;
  username: string;
  status: string;
  total_xp: number;
  role?: { role_name: string };
  level?: { name: string };
}
interface Paginated<T> {
  data: T[];
  links: { url: string | null; label: string; active: boolean }[];
}

export default function Users({
  users,
  filters,
}: {
  users: Paginated<UserRow>;
  filters: { search?: string };
}) {
  const [search, setSearch] = useState(filters.search ?? '');
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', username: '' });
  const [saving, setSaving] = useState(false);

  const toggleStatus = (user: UserRow) => {
    if (!confirm(`${user.status === 'Active' ? 'Blokir' : 'Aktifkan kembali'} akun ${user.name}?`)) return;
    setActionError(null);
    setPendingId(user.users_id);
    router.post(
      `/admin/users/${user.users_id}/toggle-status`,
      {},
      {
        preserveScroll: true,
        onError: () => setActionError('Gagal mengubah status. Coba lagi.'),
        onFinish: () => setPendingId(null),
      },
    );
  };

  const openEdit = (user: UserRow) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email, username: user.username });
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    router.put(`/admin/users/${editingUser.users_id}`, editForm, {
      preserveScroll: true,
      onSuccess: () => setEditingUser(null),
      onError: () => setActionError('Gagal menyimpan perubahan.'),
      onFinish: () => setSaving(false),
    });
  };

  const deleteUser = (user: UserRow) => {
    if (!confirm(`Hapus akun ${user.name}? Tindakan ini tidak bisa dibatalkan.`)) return;
    setActionError(null);
    setPendingId(user.users_id);
    router.delete(`/admin/users/${user.users_id}`, {
      preserveScroll: true,
      onError: () => setActionError('Gagal menghapus akun.'),
      onFinish: () => setPendingId(null),
    });
  };

  return (
    <AppLayout title="Kelola Pengguna" role="Admin">
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#8D89B0]">Admin</p>
        <h1 className="font-fraunces text-3xl text-[#EDE9FE]">Pengguna</h1>
      </header>

      {actionError && (
        <p className="mt-4 rounded-lg bg-[#F87171]/12 px-3 py-2 font-manrope text-sm text-[#F87171]">
          {actionError}
        </p>
      )}

      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D89B0]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' && router.get('/admin/users', { search }, { preserveState: true })
          }
          placeholder="Cari nama atau email..."
          className="w-full rounded-full border border-[#312E81] bg-[#0A1128] py-2.5 pl-10 pr-4 font-manrope text-sm text-[#EDE9FE] placeholder:text-[#8D89B0] focus:border-[#8B5CF6]/50 focus:outline-none"
        />
      </div>

      <section className="mt-6 overflow-hidden rounded-xl border border-[#312E81] bg-[#0A1128]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#312E81] font-manrope text-xs uppercase tracking-[0.1em] text-[#8D89B0]">
              <th className="px-5 py-3 font-normal">Nama</th>
              <th className="px-5 py-3 font-normal">Role</th>
              <th className="px-5 py-3 font-normal">XP</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#312E81]">
            {users.data.map((user) => (
              <tr key={user.users_id}>
                <td className="px-5 py-3.5">
                  <p className="font-manrope text-sm text-[#EDE9FE]">{user.name}</p>
                  <p className="font-manrope text-xs text-[#8D89B0]">{user.email}</p>
                </td>
                <td className="px-5 py-3.5 font-manrope text-xs text-[#DDD6FE]">
                  {user.role?.role_name ?? '-'}
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-[#8B5CF6]">{user.total_xp}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 font-manrope text-[11px] ${
                      user.status === 'Active'
                        ? 'bg-[#4C8C86]/12 text-[#4C8C86]'
                        : 'bg-[#F87171]/12 text-[#F87171]'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(user)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-manrope text-xs text-[#DDD6FE] hover:bg-white/10"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(user)}
                      disabled={pendingId === user.users_id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-manrope text-xs text-[#DDD6FE] hover:bg-white/10 disabled:opacity-50"
                    >
                      {pendingId === user.users_id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : user.status === 'Active' ? (
                        <ShieldBan size={13} />
                      ) : (
                        <ShieldCheck size={13} />
                      )}
                      {pendingId === user.users_id
                        ? 'Memproses...'
                        : user.status === 'Active'
                          ? 'Blokir'
                          : 'Aktifkan'}
                    </button>
                    <button
                      onClick={() => deleteUser(user)}
                      disabled={pendingId === user.users_id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#F87171]/12 px-3 py-1.5 font-manrope text-xs text-[#F87171] hover:bg-[#F87171]/20 disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {users.links.length > 3 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {users.links.map((link, i) => (
            <button
              key={i}
              disabled={!link.url}
              onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
              className={`rounded-lg px-3 py-1.5 font-manrope text-xs ${
                link.active ? 'bg-[#8B5CF6] text-[#020617]' : 'bg-white/5 text-[#DDD6FE] disabled:opacity-30'
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-xl border border-[#312E81] bg-[#0A1128] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-fraunces text-xl text-[#EDE9FE]">Edit Pengguna</h2>
              <button onClick={() => setEditingUser(null)} className="text-[#8D89B0] hover:text-[#EDE9FE]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submitEdit} className="mt-5 space-y-4">
              <div>
                <label className="font-manrope text-xs text-[#8D89B0]">Nama</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-manrope text-xs text-[#8D89B0]">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-manrope text-xs text-[#8D89B0]">Username</label>
                <input
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
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