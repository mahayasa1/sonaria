import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Search, Users, Music2, Sparkles } from 'lucide-react';
import { QuestScreen, PixelPanel, CornerBrackets, PixelButton } from '@/components/quest/quest-ui';

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

  return (
    <AppLayout title="Cari Komunitas" role="Member" hideSidebar>
      <QuestScreen>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <header className="flex flex-col items-start justify-between gap-4 sm:flex-row">
            <div>
              <p className="text-[10px] font-[var(--font-pixel)] tracking-[0.25em] text-[#93C5FD] uppercase">
                Alur berikutnya
              </p>
              <h1 className="mt-2 text-2xl font-[var(--font-pixel)] text-white sm:text-3xl">
                Cari guild
              </h1>
              <p className="mt-2 max-w-xl font-[var(--font-pixel-mono)] text-sm text-[#C7D2FE]">
                Gabung ke komunitas untuk mulai mengerjakan Main Quest, Daily
                Mission, Challenge, dan berdiskusi di forum.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <PixelButton as={Link} href="/communities/create" variant="solid">
                + Buat Guild
              </PixelButton>
              <PixelButton as={Link} href="/onboarding/category" variant="outline">
                Ganti Instrument
              </PixelButton>
            </div>
          </header>

          {flashMessage && (
            <div className="mt-5">
              <PixelPanel borderColor="rgba(147,197,253,0.3)">
                <p className="px-4 py-3 font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2]">
                  {flashMessage}
                </p>
              </PixelPanel>
            </div>
          )}

          {/* Search */}
          <div className="mt-7">
            <PixelPanel>
              <div className="relative flex items-center">
                <Search size={16} className="pointer-events-none absolute left-4 text-[#93C5FD]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applyFilters({ search });
                  }}
                  placeholder="cari nama guild..."
                  className="w-full bg-transparent py-3.5 pl-11 pr-4 font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2] placeholder:text-[#93C5FD]/50 focus:outline-none"
                />
              </div>
            </PixelPanel>
          </div>

          {/* Grid Komunitas */}
          {communities.data.length === 0 ? (
            <div className="mt-10">
              <PixelPanel>
                <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                  <Users size={28} className="text-[#93C5FD]/50" />
                  <p className="text-sm font-[var(--font-pixel)] text-white">
                    Belum ada guild ditemukan
                  </p>
                  <p className="max-w-sm font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/70">
                    Coba ubah kata kunci pencarian atau pilih instrument lain.
                  </p>
                </div>
              </PixelPanel>
            </div>
          ) : (
            <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {communities.data.map((community) => (
                <div key={community.communities_id} className="group relative">
                  <CornerBrackets />
                  <Link href={`/communities/${community.communities_id}`} className="block">
                    <PixelPanel className="transition-colors duration-300 group-hover:bg-white/[0.03]">
                      <div>
                        <div className="h-24 bg-gradient-to-br from-[#1E3A8A]/60 via-[#312E81]/50 to-[#0B1120]" />
                        <div className="p-5">
                          <div className="flex items-center gap-2 text-[#38BDF8]">
                            <Music2 size={14} />
                            <span className="text-[10px] font-[var(--font-pixel)] uppercase tracking-[0.14em]">
                              {community.instrument?.name ?? community.category?.name ?? 'Umum'}
                            </span>
                          </div>
                          <p className="mt-2 text-base font-[var(--font-pixel)] text-white">
                            {community.community_name}
                          </p>
                          {community.description && (
                            <p className="mt-2 line-clamp-2 font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/70">
                              {community.description}
                            </p>
                          )}
                          <div className="mt-4 flex items-center gap-1.5 font-[var(--font-pixel-mono)] text-xs text-[#CBD5F5]">
                            <Users size={13} />
                            {community.total_member} anggota
                          </div>
                        </div>
                      </div>
                    </PixelPanel>
                  </Link>
                </div>
              ))}
            </section>
          )}

          {communities.links.length > 3 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {communities.links.map((link, index) => (
                <button
                  key={index}
                  disabled={!link.url}
                  onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                  className={`px-3.5 py-2 text-[11px] font-[var(--font-pixel)] transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                    link.active
                      ? 'text-[#0B1120]'
                      : 'border border-white/15 bg-white/[0.03] text-[#93C5FD] hover:border-[#38BDF8]/40'
                  }`}
                  style={
                    link.active
                      ? { clipPath: undefined, background: 'linear-gradient(90deg,#38BDF8,#818CF8)' }
                      : undefined
                  }
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          )}

          {/* jejak flavor */}
          <div className="mt-10 flex items-center gap-2 font-[var(--font-pixel-mono)] text-[10px] text-[#93C5FD]/50">
            <Sparkles size={12} />
            tips: gabung lebih dari satu guild kalau instrumenmu lebih dari satu jenis
          </div>
        </div>
      </QuestScreen>
    </AppLayout>
  );
}