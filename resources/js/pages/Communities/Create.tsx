import React, { useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { apiFetch, ApiError } from '@/lib/api';
import { ArrowLeft, Lock, Sparkles, Loader2 } from 'lucide-react';

interface InstrumentItem {
  intruments_id: number;
  name: string;
  category_id: number;
}

export default function Create({
  canCreate,
  currentLevel,
  instruments,
  currentInstrument,
}: {
  canCreate: boolean;
  currentLevel: { level: number; title: string } | null;
  instruments: InstrumentItem[];
  currentInstrument?: { intruments_id: number; name: string } | null;
}) {
  const [instrumentId, setInstrumentId] = useState<number | ''>(
    currentInstrument?.intruments_id ?? '',
  );
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => communityName.trim().length > 0 && instrumentId !== '',
    [communityName, instrumentId],
  );

  const submit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const community = await apiFetch<{ communities_id: number }>('/api/communities', {
        method: 'POST',
        body: JSON.stringify({
          instrument_id: instrumentId,
          community_name: communityName,
          description: description || undefined,
        }),
      });
      router.visit(`/communities/${community.communities_id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal membuat komunitas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Buat Komunitas" role="Member" hideSidebar>
      <Link href="/communities" className="flex items-center gap-1.5 font-manrope text-xs text-[#75708A] hover:text-[#F3EEE2]">
        <ArrowLeft size={14} /> Kembali ke daftar komunitas
      </Link>

      <header className="mt-3">
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <Sparkles size={24} className="text-[#D9A441]" /> Komunitas Baru
        </h1>
        <p className="mt-2 max-w-xl font-manrope text-sm text-[#B7AFC2]">
          Sebagai pengelola (Ketua), kamu akan bisa mengatur Main Quest, Daily
          Mission, Challenge, dan member komunitas ini.
        </p>
      </header>

      {!canCreate ? (
        <div className="mt-8 max-w-lg rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
          <div className="flex items-center gap-2 text-[#C1443C]">
            <Lock size={16} />
            <span className="font-manrope text-xs uppercase tracking-[0.14em]">Belum terbuka</span>
          </div>
          <p className="mt-3 font-manrope text-sm text-[#F3EEE2]">
            Kamu belum bisa membuat komunitas sendiri.
          </p>
          <p className="mt-1 font-manrope text-xs text-[#75708A]">
            {currentLevel
              ? `Level kamu saat ini: Level ${currentLevel.level} — ${currentLevel.title}. Fitur ini terbuka mulai Level 7.`
              : 'Selesaikan onboarding dan naikkan level dulu untuk membuka fitur ini.'}
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-block rounded-full bg-[#D9A441] px-5 py-2 font-manrope text-xs text-[#14101B]"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      ) : (
        <div className="mt-8 max-w-lg space-y-4">
          <div>
            <label className="font-manrope text-xs text-[#75708A]">Instrument</label>
            <select
              value={instrumentId}
              onChange={(e) => setInstrumentId(e.target.value ? Number(e.target.value) : '')}
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
            >
              <option value="">Pilih instrument...</option>
              {instruments.map((instrument) => (
                <option key={instrument.intruments_id} value={instrument.intruments_id}>
                  {instrument.name}
                </option>
              ))}
            </select>
            <p className="mt-1 font-manrope text-[11px] text-[#75708A]">
              Menentukan kategori komunitas ini & memudahkan user lain menemukannya saat mencari komunitas.
            </p>
          </div>

          <div>
            <label className="font-manrope text-xs text-[#75708A]">Nama Komunitas</label>
            <input
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              maxLength={150}
              placeholder="mis. Gitaris Bali Bersatu"
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-manrope text-xs text-[#75708A]">Deskripsi (opsional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={255}
              placeholder="Ceritakan singkat komunitas ini untuk siapa dan tentang apa."
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
            />
          </div>

          <button
            onClick={submit}
            disabled={loading || !canSubmit}
            className="flex items-center gap-2 rounded-full bg-[#D9A441] px-6 py-2.5 font-manrope text-sm text-[#14101B] disabled:opacity-40"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Buat Komunitas
          </button>
          {error && <p className="font-manrope text-xs text-[#C1443C]">{error}</p>}
        </div>
      )}
    </AppLayout>
  );
}
