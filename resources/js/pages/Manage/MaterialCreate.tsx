import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { apiFetch, ApiError } from '@/lib/api';
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react';

interface Instrument {
  intruments_id: number;
  name: string;
}
interface MainQuest {
  main_quests_id: number;
  title: string;
  community: { community_name: string };
}

export default function MaterialCreate({
  mainQuest,
  instruments,
  communityRole,
}: {
  mainQuest: MainQuest;
  instruments: Instrument[];
  communityRole?: string | null;
}) {
  const [instrumentId, setInstrumentId] = useState<number | string>(instruments[0]?.intruments_id ?? '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<number | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const material = await apiFetch<{ materials_id: number }>(
        `/api/main-quests/${mainQuest.main_quests_id}/materials`,
        {
          method: 'POST',
          body: JSON.stringify({
            instrument_id: Number(instrumentId),
            title,
            description,
            difficulty,
            estimated_time: estimatedTime,
            status: 'Published',
          }),
        },
      );
      setCreatedId(material.materials_id);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal membuat materi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Tambah Materi" role="Member" communityRole={communityRole} communityName={mainQuest.community.community_name}>
      <Link
        href={`/main-quests/${mainQuest.main_quests_id}`}
        className="flex items-center gap-1.5 font-manrope text-xs text-[#75708A] hover:text-[#F3EEE2]"
      >
        <ArrowLeft size={14} /> Kembali ke {mainQuest.title}
      </Link>

      <header className="mt-3">
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <BookOpen size={24} className="text-[#D9A441]" /> Materi Baru
        </h1>
        <p className="mt-1 font-manrope text-sm text-[#75708A]">untuk {mainQuest.title}</p>
      </header>

      {createdId ? (
        <div className="mt-6 max-w-lg space-y-3 rounded-xl border border-[#4C8C86]/30 bg-[#4C8C86]/8 p-6">
          <p className="font-manrope text-sm text-[#4C8C86]">
            Materi berhasil dibuat. Sekarang tambahkan File Materi (video/PDF), Quiz, dan/atau Practice untuk materi ini.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/manage/materials/${createdId}/files/create`}
              className="rounded-full bg-[#4C8C86] px-5 py-2.5 font-manrope text-sm text-[#14101B]"
            >
              Tambah File Materi
            </Link>
            <Link
              href={`/manage/materials/${createdId}/quizzes/create`}
              className="rounded-full bg-[#D9A441] px-5 py-2.5 font-manrope text-sm text-[#14101B]"
            >
              Tambah Quiz
            </Link>
            <Link
              href={`/manage/materials/${createdId}/practices/create`}
              className="rounded-full border border-[#D9A441]/40 px-5 py-2.5 font-manrope text-sm text-[#D9A441]"
            >
              Tambah Practice
            </Link>
            <Link
              href={`/main-quests/${mainQuest.main_quests_id}`}
              className="rounded-full border border-[#2A2333] px-5 py-2.5 font-manrope text-sm text-[#B7AFC2]"
            >
              Selesai
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 max-w-lg space-y-4">
          <div>
            <label className="font-manrope text-xs text-[#75708A]">Instrument</label>
            <select
              value={instrumentId}
              onChange={(e) => setInstrumentId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
            >
              {instruments.map((i) => (
                <option key={i.intruments_id} value={i.intruments_id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-manrope text-xs text-[#75708A]">Judul</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-manrope text-xs text-[#75708A]">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-manrope text-xs text-[#75708A]">Kesulitan</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="font-manrope text-xs text-[#75708A]">Estimasi (menit)</label>
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={submit}
            disabled={loading || !title}
            className="flex items-center gap-2 rounded-full bg-[#D9A441] px-6 py-2.5 font-manrope text-sm text-[#14101B] disabled:opacity-40"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Simpan &amp; Lanjut
          </button>
          {error && <p className="font-manrope text-xs text-[#C1443C]">{error}</p>}
        </div>
      )}
    </AppLayout>
  );
}
