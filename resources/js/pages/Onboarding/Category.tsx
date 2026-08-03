import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Music2, Check, Loader2 } from 'lucide-react';

interface Instrument {
  intruments_id: number;
  name: string;
  description?: string;
  image?: string;
  difficulty?: string;
}

interface Category {
  music_categories_id: number;
  name: string;
  description?: string;
  instruments: Instrument[];
}

export default function Category({
  categories,
  currentInstrumentId,
}: {
  categories: Category[];
  currentInstrumentId: number | null;
}) {
  const [activeCategory, setActiveCategory] = useState<number | null>(
    categories.find((c) => c.instruments.some((i) => i.intruments_id === currentInstrumentId))
      ?.music_categories_id ?? null,
  );
  const [selected, setSelected] = useState<number | null>(currentInstrumentId);
  const [submitting, setSubmitting] = useState(false);

  const submit = () => {
    if (!selected) return;
    setSubmitting(true);
    router.post(
      '/onboarding/instrument',
      { instrument_id: selected },
      { onFinish: () => setSubmitting(false) },
    );
  };

  return (
    <AppLayout title="Pilih Kategori Alat Musik" role="Member" hideSidebar>
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
          Satu langkah lagi
        </p>
        <h1 className="font-fraunces text-3xl text-[#F3EEE2]">Pilih alat musikmu</h1>
        <p className="mt-2 max-w-xl font-manrope text-sm text-[#B7AFC2]">
          Instrument yang kamu pilih menentukan komunitas dan materi yang akan direkomendasikan
          untukmu. Kamu hanya bisa memilih satu.
        </p>
      </header>

      {/* Pilih kategori */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.music_categories_id}
            onClick={() => setActiveCategory(cat.music_categories_id)}
            className={`rounded-full border px-4 py-2 font-manrope text-sm transition-colors ${
              activeCategory === cat.music_categories_id
                ? 'border-[#D9A441] bg-[#D9A441]/12 text-[#D9A441]'
                : 'border-[#2A2333] text-[#B7AFC2] hover:border-[#D9A441]/40'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid instrument dari kategori terpilih */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(categories.find((c) => c.music_categories_id === activeCategory)?.instruments ?? []).map(
          (instrument) => {
            const isSelected = selected === instrument.intruments_id;

            return (
              <button
                key={instrument.intruments_id}
                onClick={() => setSelected(instrument.intruments_id)}
                className={`rounded-xl border p-5 text-left transition-colors ${
                  isSelected
                    ? 'border-[#D9A441] bg-[#D9A441]/8'
                    : 'border-[#2A2333] bg-[#1E1826] hover:border-[#D9A441]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-[#D9A441]">
                    <Music2 size={18} />
                  </span>
                  {isSelected && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D9A441] text-[#14101B]">
                      <Check size={14} />
                    </span>
                  )}
                </div>
                <p className="mt-4 font-fraunces text-lg text-[#F3EEE2]">{instrument.name}</p>
                {instrument.description && (
                  <p className="mt-1 font-manrope text-xs text-[#75708A]">{instrument.description}</p>
                )}
              </button>
            );
          },
        )}

        {activeCategory === null && (
          <p className="col-span-full font-manrope text-sm text-[#75708A]">
            Pilih kategori di atas untuk melihat daftar instrument.
          </p>
        )}
      </section>

      <div className="mt-8 flex justify-end">
        <button
          onClick={submit}
          disabled={!selected || submitting}
          className="flex items-center gap-2 rounded-full bg-[#D9A441] px-6 py-3 font-manrope text-sm text-[#14101B] transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Lanjut cari komunitas
        </button>
      </div>
    </AppLayout>
  );
}
