import React, { useState } from 'react';
import AppLayout from '@/layouts/AppLayout';
import EmptyState from '@/components/EmptyState';
import { apiFetch, ApiError } from '@/lib/api';
import { Trophy, Calendar, Loader2, Clock3 } from 'lucide-react';

interface Challenge {
  challenges_id: number;
  title: string;
  description?: string;
  xp_reward: number;
  point_reward?: number;
  end_date: string;
  instrument?: { name: string };
}

interface Submission {
  status: string;
  score?: number;
  feedback?: string;
}

export default function Index({
  community,
  challenge,
  mySubmission,
}: {
  community: { community_name: string };
  challenge: Challenge | null;
  mySubmission: Submission | null;
}) {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoPath, setVideoPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState(mySubmission);

  const daysLeft = challenge
    ? Math.max(0, Math.ceil((new Date(challenge.end_date).getTime() - Date.now()) / 86_400_000))
    : 0;

  const submit = async () => {
    if (!challenge || !videoPath) return;
    setLoading(true);
    setError(null);
    try {
      const created = await apiFetch<Submission>(`/api/challenges/${challenge.challenges_id}/submissions`, {
        method: 'POST',
        body: JSON.stringify({ video_title: videoTitle, video_path: videoPath }),
      });
      setSubmission(created);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal mengirim video challenge.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Challenge" role="Member" communityName={community.community_name}>
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
          {community.community_name}
        </p>
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <Trophy size={24} className="text-[#D9A441]" /> Challenge
        </h1>
      </header>

      {!challenge ? (
        <div className="mt-8">
          <EmptyState
            icon={Trophy}
            title="Belum ada Challenge aktif"
            description="Pengelola komunitas belum membuka challenge baru. Cek lagi nanti."
          />
        </div>
      ) : (
        <section className="mt-8 overflow-hidden rounded-xl border border-[#2A2333] bg-[#1E1826]">
          <div className="h-32 bg-gradient-to-br from-[#D9A441]/30 via-[#1E1826] to-[#1E1826]" />
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-fraunces text-2xl text-[#F3EEE2]">{challenge.title}</h2>
              <span className="rounded-full bg-[#D9A441]/12 px-4 py-1.5 font-mono text-sm text-[#D9A441]">
                +{challenge.xp_reward} XP
              </span>
            </div>
            {challenge.description && (
              <p className="mt-2 max-w-xl font-manrope text-sm text-[#B7AFC2]">
                {challenge.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-5 font-manrope text-xs text-[#75708A]">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                Berakhir {new Date(challenge.end_date).toLocaleDateString('id-ID')}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 size={13} /> {daysLeft} hari lagi
              </span>
              {challenge.instrument && <span>Instrument: {challenge.instrument.name}</span>}
            </div>

            <div className="mt-6 border-t border-[#2A2333] pt-6">
              {submission ? (
                <div
                  className={`rounded-lg p-4 font-manrope text-sm ${
                    submission.status === 'Approved'
                      ? 'bg-[#4C8C86]/12 text-[#4C8C86]'
                      : submission.status === 'Rejected'
                        ? 'bg-[#C1443C]/12 text-[#C1443C]'
                        : 'bg-[#D9A441]/12 text-[#D9A441]'
                  }`}
                >
                  Status submission kamu: <strong>{submission.status}</strong>
                  {submission.feedback && <p className="mt-1 text-xs opacity-80">{submission.feedback}</p>}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
                    Upload Video Latihan
                  </p>
                  <input
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Judul video (opsional)"
                    className="w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
                  />
                  <input
                    value={videoPath}
                    onChange={(e) => setVideoPath(e.target.value)}
                    placeholder="Link video (YouTube/Drive, dsb.)"
                    className="w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
                  />
                  <button
                    onClick={submit}
                    disabled={loading || !videoPath}
                    className="flex items-center gap-2 rounded-full bg-[#D9A441] px-5 py-2.5 font-manrope text-sm text-[#14101B] disabled:opacity-40"
                  >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Kirim ke Challenge
                  </button>
                  {error && <p className="font-manrope text-xs text-[#C1443C]">{error}</p>}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </AppLayout>
  );
}
