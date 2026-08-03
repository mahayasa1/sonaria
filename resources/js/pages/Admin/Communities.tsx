import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Search, Ban, CheckCircle2 } from 'lucide-react';

interface CommunityRow {
  communities_id: number;
  community_name: string;
  total_member: number;
  status: string;
  category?: { name: string };
  owner?: { name: string };
}
interface Paginated<T> {
  data: T[];
  links: { url: string | null; label: string; active: boolean }[];
}

export default function Communities({
  communities,
  filters,
}: {
  communities: Paginated<CommunityRow>;
  filters: { search?: string };
}) {
  const [search, setSearch] = useState(filters.search ?? '');

  const toggleStatus = (community: CommunityRow) => {
    if (!confirm(`${community.status === 'Active' ? 'Nonaktifkan' : 'Aktifkan'} komunitas ${community.community_name}?`))
      return;
    router.post(`/admin/communities/${community.communities_id}/toggle-status`, {}, { preserveScroll: true });
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
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-xs text-[#D9A441]">{c.total_member} anggota</span>
              <button
                onClick={() => toggleStatus(c)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-manrope text-xs text-[#B7AFC2] hover:bg-white/10"
              >
                {c.status === 'Active' ? <Ban size={13} /> : <CheckCircle2 size={13} />}
                {c.status === 'Active' ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
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
    </AppLayout>
  );
}
