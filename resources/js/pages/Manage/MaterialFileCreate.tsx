import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { apiFetch, ApiError } from '@/lib/api';
import { ArrowLeft, FileVideo, Loader2 } from 'lucide-react';

interface Material {
  materials_id: number;
  title: string;
  main_quest: { main_quests_id: number; community: { community_name: string } };
}

const FILE_TYPES = [
  { value: 'Video', label: 'Video' },
  { value: 'PDF', label: 'PDF' },
  { value: 'Audio', label: 'Audio' },
  { value: 'Image', label: 'Gambar' },
] as const;

export default function MaterialFileCreate({ material, communityRole }: { material: Material; communityRole?: string | null }) {
  const [fileType, setFileType] = useState<(typeof FILE_TYPES)[number]['value']>('Video');
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [filePath, setFilePath] = useState('');
  const [duration, setDuration] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const isTimeBased = fileType === 'Video' || fileType === 'Audio';

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/api/materials/${material.materials_id}/files`, {
        method: 'POST',
        body: JSON.stringify({
          file_type: fileType,
          title,
          file_name: fileName,
          file_path: filePath,
          duration: isTimeBased && duration ? duration : null,
          file_size: fileSize ? Number(fileSize) : null,
        }),
      });
      setDone(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal menambahkan file materi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Tambah File Materi"
      role="Member"
      communityRole={communityRole}
      communityName={material.main_quest.community.community_name}
    >
      <Link
        href={`/main-quests/${material.main_quest.main_quests_id}`}
        className="flex items-center gap-1.5 font-manrope text-xs text-[#75708A] hover:text-[#F3EEE2]"
      >
        <ArrowLeft size={14} /> Kembali
      </Link>

      <header className="mt-3">
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <FileVideo size={24} className="text-[#4C8C86]" /> File Materi Baru
        </h1>
        <p className="mt-1 font-manrope text-sm text-[#75708A]">untuk materi {material.title}</p>
      </header>

      {done ? (
        <div className="mt-6 max-w-lg space-y-3 rounded-xl border border-[#4C8C86]/30 bg-[#4C8C86]/8 p-6">
          <p className="font-manrope text-sm text-[#4C8C86]">File materi berhasil ditambahkan.</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setDone(false);
                setTitle('');
                setFileName('');
                setFilePath('');
                setDuration('');
                setFileSize('');
              }}
              className="rounded-full border border-[#D9A441]/40 px-5 py-2.5 font-manrope text-sm text-[#D9A441]"
            >
              Tambah File Lain
            </button>
            <Link
              href={`/main-quests/${material.main_quest.main_quests_id}`}
              className="rounded-full bg-[#D9A441] px-5 py-2.5 font-manrope text-sm text-[#14101B]"
            >
              Selesai
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 max-w-lg space-y-4">
          <div>
            <label className="font-manrope text-xs text-[#75708A]">Jenis File</label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value as typeof fileType)}
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
            >
              {FILE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-manrope text-xs text-[#75708A]">Judul File</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="mis. Pengenalan Kunci Dasar"
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A]/60 focus:border-[#D9A441]/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-manrope text-xs text-[#75708A]">Nama File</label>
            <input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="mis. kunci-dasar.mp4"
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A]/60 focus:border-[#D9A441]/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-manrope text-xs text-[#75708A]">Link / Path File</label>
            <input
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="URL video/PDF (YouTube, Drive, storage, dsb.)"
              className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A]/60 focus:border-[#D9A441]/50 focus:outline-none"
            />
            <p className="mt-1 font-manrope text-[11px] text-[#75708A]">
              Unggah file ke storage/CDN terlebih dahulu, lalu tempel link/path-nya di sini.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {isTimeBased && (
              <div>
                <label className="font-manrope text-xs text-[#75708A]">Durasi (mis. 05:30)</label>
                <input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="00:00"
                  className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A]/60 focus:border-[#D9A441]/50 focus:outline-none"
                />
              </div>
            )}
            <div>
              <label className="font-manrope text-xs text-[#75708A]">Ukuran File (bytes, opsional)</label>
              <input
                type="number"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#1E1826] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={submit}
            disabled={loading || !title || !fileName || !filePath}
            className="flex items-center gap-2 rounded-full bg-[#D9A441] px-6 py-2.5 font-manrope text-sm text-[#14101B] disabled:opacity-40"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Simpan File Materi
          </button>
          {error && <p className="font-manrope text-xs text-[#C1443C]">{error}</p>}
        </div>
      )}
    </AppLayout>
  );
}
