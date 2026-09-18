import React, { useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { apiFetch, ApiError } from '@/lib/api';
import { ArrowLeft, Lock, Sparkles, Loader2 } from 'lucide-react';
import { QuestScreen, PixelPanel, PixelButton } from '@/components/quest/quest-ui';

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

  const inputClass =
    'mt-1 w-full bg-transparent px-4 py-3 font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2] placeholder:text-[#93C5FD]/40 focus:outline-none';
  const labelClass =
    'text-[10px] font-[var(--font-pixel)] uppercase tracking-[0.18em] text-[#93C5FD]';

  return (
    <AppLayout title="Buat Komunitas" role="Member" hideSidebar>
      <QuestScreen>
        <div className="mx-auto max-w-2xl px-6 py-10">
          <Link
            href="/communities"
            className="flex items-center gap-1.5 font-[var(--font-pixel-mono)] text-xs text-[#93C5FD] hover:text-white"
          >
            <ArrowLeft size={14} /> Kembali ke daftar guild
          </Link>

          <header className="mt-4">
            <h1 className="flex items-center gap-2 text-2xl font-[var(--font-pixel)] text-white sm:text-3xl">
              <Sparkles size={22} className="text-[#38BDF8]" /> Guild Baru
            </h1>
            <p className="mt-3 max-w-xl font-[var(--font-pixel-mono)] text-sm text-[#C7D2FE]">
              Sebagai pengelola (Ketua), kamu akan bisa mengatur Main Quest, Daily
              Mission, Challenge, dan member guild ini.
            </p>
          </header>

          {!canCreate ? (
            <div className="mt-8">
              <PixelPanel borderColor="rgba(248,113,113,0.3)">
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[#F87171]">
                    <Lock size={16} />
                    <span className="text-[10px] font-[var(--font-pixel)] uppercase tracking-[0.18em]">
                      Quest terkunci
                    </span>
                  </div>
                  <p className="mt-4 font-[var(--font-pixel)] text-sm text-white">
                    Kamu belum bisa membuat guild sendiri.
                  </p>
                  <p className="mt-2 font-[var(--font-pixel-mono)] text-xs leading-relaxed text-[#93C5FD]/70">
                    {currentLevel
                      ? `Level kamu saat ini: Level ${currentLevel.level} — ${currentLevel.title}. Fitur ini terbuka mulai Level 7.`
                      : 'Selesaikan onboarding dan naikkan level dulu untuk membuka fitur ini.'}
                  </p>
                  <div className="mt-6">
                    <PixelButton as={Link} href="/dashboard" variant="outline">
                      Kembali ke Dashboard
                    </PixelButton>
                  </div>
                </div>
              </PixelPanel>
            </div>
          ) : (
            <div className="mt-8">
              <PixelPanel>
                <div className="space-y-5 p-6">
                  <div>
                    <label className={labelClass}>Instrument</label>
                    <PixelPanel borderColor="rgba(255,255,255,0.12)" bg="rgba(6,10,25,0.4)" className="mt-1">
                      <select
                        value={instrumentId}
                        onChange={(e) =>
                          setInstrumentId(e.target.value ? Number(e.target.value) : '')
                        }
                        className="w-full bg-transparent px-4 py-3 font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2] focus:outline-none"
                      >
                        <option value="" className="bg-[#0B1120]">
                          Pilih instrument...
                        </option>
                        {instruments.map((instrument) => (
                          <option
                            key={instrument.intruments_id}
                            value={instrument.intruments_id}
                            className="bg-[#0B1120]"
                          >
                            {instrument.name}
                          </option>
                        ))}
                      </select>
                    </PixelPanel>
                    <p className="mt-2 font-[var(--font-pixel-mono)] text-[11px] text-[#93C5FD]/60">
                      Menentukan kategori guild ini & memudahkan user lain menemukannya saat mencari komunitas.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Nama Guild</label>
                    <PixelPanel borderColor="rgba(255,255,255,0.12)" bg="rgba(6,10,25,0.4)" className="mt-1">
                      <input
                        value={communityName}
                        onChange={(e) => setCommunityName(e.target.value)}
                        maxLength={150}
                        placeholder="mis. Gitaris Bali Bersatu"
                        className={inputClass}
                      />
                    </PixelPanel>
                  </div>

                  <div>
                    <label className={labelClass}>Deskripsi (opsional)</label>
                    <PixelPanel borderColor="rgba(255,255,255,0.12)" bg="rgba(6,10,25,0.4)" className="mt-1">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        maxLength={255}
                        placeholder="Ceritakan singkat guild ini untuk siapa dan tentang apa."
                        className={`${inputClass} resize-none`}
                      />
                    </PixelPanel>
                  </div>

                  <PixelButton onClick={submit} disabled={loading || !canSubmit} variant="solid">
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Buat Guild
                  </PixelButton>
                  {error && (
                    <p className="font-[var(--font-pixel-mono)] text-xs text-[#F87171]">{error}</p>
                  )}
                </div>
              </PixelPanel>
            </div>
          )}
        </div>
      </QuestScreen>
    </AppLayout>
  );
}