import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import EmptyState from '@/components/EmptyState';
import { Search, Users, Music2 } from 'lucide-react';

interface InstrumentItem {
  intruments_id: number;
  name: string;
  category_id: number;
}

interface Category {
  music_categories_id: number;
  name: string;
}

interface CommunityItem {
  communities_id: number;
  community_name: string;
  description?: string;
  banner?: string;
  logo?: string;
  total_member: number;
  category?: Category;
  instrument?: InstrumentItem;
}

interface Paginated<T> {
  data: T[];
  links: { url: string | null; label: string; active: boolean }[];
}

interface PageProps {
  flash?: { success?: string; error?: string; info?: string };
  [key: string]: any;
}

export default function Index({
  communities,
  instruments,
  filters,
  currentInstrument,
}: {
  communities: Paginated<CommunityItem>;
  instruments: InstrumentItem[];
  filters: { search?: string; instrument_id?: string };
  currentInstrument?: { intruments_id: number; name: string } | null;
}) {
  const { props } = usePage<PageProps>();
  const [search, setSearch] = useState(filters.search ?? '');

  const applyFilters = (next: Partial<typeof filters>) => {
    router.get('/communities', { ...filters, ...next }, { preserveState: true, replace: true });
  };

  const flashMessage = props.flash?.info ?? props.flash?.success ?? props.flash?.error;
  const activeInstrumentId = filters.instrument_id ? Number(filters.instrument_id) : currentInstrument?.intruments_id;

  return (
    <AppLayout title="Cari Komunitas" role="Member" hideSidebar>
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
            Alur berikutnya
          </p>
          <h1 className="font-fraunces text-3xl text-[#F3EEE2]">Cari komunitas</h1>
          <p className="mt-2 max-w-xl font-manrope text-sm text-[#B7AFC2]">
            Gabung ke komunitas untuk mulai mengerjakan Main Quest, Daily
            Mission, Challenge, dan berdiskusi di forum.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/communities/create"
            className="whitespace-nowrap rounded-full bg-[#D9A441] px-4 py-2 font-manrope text-xs text-[#14101B] transition-opacity hover:opacity-90"
          >
            + Buat Komunitas
          </Link>
          <Link
            href="/onboarding/category"
            className="whitespace-nowrap rounded-full border border-[#2A2333] px-4 py-2 font-manrope text-xs text-[#B7AFC2] transition-colors hover:border-[#D9A441]/40 hover:text-[#D9A441]"
          >
            Ganti Instrument
          </Link>
        </div>
      </header>

      {flashMessage && (
        <div className="mt-4 rounded-lg border border-[#2A2333] bg-[#1E1826] px-4 py-3 font-manrope text-sm text-[#F3EEE2]">
          {flashMessage}
        </div>
      )}

      {/* Search */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75708A]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyFilters({ search });
            }}
            placeholder="Cari nama komunitas..."
            className="w-full rounded-full border border-[#2A2333] bg-[#1E1826] py-2.5 pl-10 pr-4 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid Komunitas */}
      {communities.data.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Users}
            title="Belum ada komunitas ditemukan"
            description="Coba ubah kata kunci pencarian atau pilih instrument lain."
          />
        </div>
      ) : (
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {communities.data.map((community) => (
            <Link
              key={community.communities_id}
              href={`/communities/${community.communities_id}`}
              className="group overflow-hidden rounded-xl border border-[#2A2333] bg-[#1E1826] transition-colors hover:border-[#D9A441]/40"
            >
              <div className="h-24 bg-gradient-to-br from-[#332B40] to-[#1E1826]" />
              <div className="p-5">
                <div className="flex items-center gap-2 text-[#D9A441]">
                  <Music2 size={14} />
                  <span className="font-manrope text-[11px] uppercase tracking-[0.14em]">
                    {community.instrument?.name ?? community.category?.name ?? 'Umum'}
                  </span>
                </div>
                <p className="mt-2 font-fraunces text-lg text-[#F3EEE2]">{community.community_name}</p>
                {community.description && (
                  <p className="mt-1 line-clamp-2 font-manrope text-xs text-[#75708A]">{community.description}</p>
                )}
                <div className="mt-4 flex items-center gap-1.5 font-manrope text-xs text-[#B7AFC2]">
                  <Users size={13} />
                  {community.total_member} anggota
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {communities.links.length > 3 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {communities.links.map((link, index) => (
            <button
              key={index}
              disabled={!link.url}
              onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
              className={`rounded-lg px-3 py-1.5 font-manrope text-xs ${
                link.active
                  ? 'bg-[#D9A441] text-[#14101B]'
                  : 'bg-white/5 text-[#B7AFC2] hover:bg-white/10 disabled:opacity-30'
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}