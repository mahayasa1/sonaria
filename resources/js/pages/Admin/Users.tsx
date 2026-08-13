import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Search, ShieldBan, ShieldCheck, Loader2 } from 'lucide-react';

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

  return (
    <AppLayout title="Kelola Pengguna" role="Admin">
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">Admin</p>
        <h1 className="font-fraunces text-3xl text-[#F3EEE2]">Pengguna</h1>
      </header>

      {actionError && (
        <p className="mt-4 rounded-lg bg-[#C1443C]/12 px-3 py-2 font-manrope text-sm text-[#C1443C]">
          {actionError}
        </p>
      )}

      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75708A]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' && router.get('/admin/users', { search }, { preserveState: true })
          }
          placeholder="Cari nama atau email..."
          className="w-full rounded-full border border-[#2A2333] bg-[#1E1826] py-2.5 pl-10 pr-4 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
        />
      </div>

      <section className="mt-6 overflow-hidden rounded-xl border border-[#2A2333] bg-[#1E1826]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#2A2333] font-manrope text-xs uppercase tracking-[0.1em] text-[#75708A]">
              <th className="px-5 py-3 font-normal">Nama</th>
              <th className="px-5 py-3 font-normal">Role</th>
              <th className="px-5 py-3 font-normal">XP</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2333]">
            {users.data.map((user) => (
              <tr key={user.users_id}>
                <td className="px-5 py-3.5">
                  <p className="font-manrope text-sm text-[#F3EEE2]">{user.name}</p>
                  <p className="font-manrope text-xs text-[#75708A]">{user.email}</p>
                </td>
                <td className="px-5 py-3.5 font-manrope text-xs text-[#B7AFC2]">
                  {user.role?.role_name ?? '-'}
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-[#D9A441]">{user.total_xp}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 font-manrope text-[11px] ${
                      user.status === 'Active'
                        ? 'bg-[#4C8C86]/12 text-[#4C8C86]'
                        : 'bg-[#C1443C]/12 text-[#C1443C]'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => toggleStatus(user)}
                    disabled={pendingId === user.users_id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-manrope text-xs text-[#B7AFC2] hover:bg-white/10 disabled:opacity-50"
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
                link.active ? 'bg-[#D9A441] text-[#14101B]' : 'bg-white/5 text-[#B7AFC2] disabled:opacity-30'
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
