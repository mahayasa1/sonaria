import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { apiFetch, ApiError } from '@/lib/api';
import { ArrowLeft, Video, Loader2 } from 'lucide-react';

interface Submission {
  practice_submissions_id: number;
  video_title?: string;
  video_path: string;
  submitted_at: string;
  status: string;
  user: { name: string; username: string };
  practice: { title: string; minimum_score: number; material: { main_quest: { community: { community_name: string } } } };
}

export default function ReviewPractice({
  submission,
  communityRole,
}: {
  submission: Submission;
  communityRole?: string | null;
}) {
  const [score, setScore] = useState(submission.practice.minimum_score);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const communityName = submission.practice.material?.main_quest?.community?.community_name;

  const submit = async (status: 'Approved' | 'Revision' | 'Rejected') => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/api/practice-submissions/${submission.practice_submissions_id}/review`, {
        method: 'POST',
        body: JSON.stringify({ score, feedback, status }),
      });
      setDone(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal mengirim review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Review Practice" role="Member" communityRole={communityRole} communityName={communityName}>
      <Link href="/dashboard" className="flex items-center gap-1.5 font-manrope text-xs text-[#75708A] hover:text-[#F3EEE2]">
        <ArrowLeft size={14} /> Kembali ke Dashboard
      </Link>

      <header className="mt-3">
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <Video size={24} className="text-[#C1443C]" /> {submission.practice.title}
        </h1>
        <p className="mt-1 font-manrope text-sm text-[#75708A]">
          oleh {submission.user.name} (@{submission.user.username})
        </p>
      </header>

      <section className="mt-6 rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">Video Latihan</p>
        <a
          href={submission.video_path}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block break-all font-manrope text-sm text-[#D9A441] underline"
        >
          {submission.video_title || submission.video_path}
        </a>

        {done ? (
          <p className="mt-6 rounded-lg bg-[#4C8C86]/12 p-4 font-manrope text-sm text-[#4C8C86]">
            Review terkirim.
          </p>
        ) : (
          <div className="mt-6 max-w-md space-y-4">
            <div>
              <label className="font-manrope text-xs text-[#75708A]">
                Skor (minimal lulus: {submission.practice.minimum_score})
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-manrope text-xs text-[#75708A]">Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => submit('Approved')}
                disabled={loading}
                className="flex items-center gap-2 rounded-full bg-[#4C8C86] px-5 py-2.5 font-manrope text-sm text-[#14101B] disabled:opacity-40"
              >
                {loading && <Loader2 size={14} className="animate-spin" />} Setujui
              </button>
              <button
                onClick={() => submit('Revision')}
                disabled={loading}
                className="rounded-full border border-[#D9A441]/40 px-5 py-2.5 font-manrope text-sm text-[#D9A441] disabled:opacity-40"
              >
                Minta Revisi
              </button>
              <button
                onClick={() => submit('Rejected')}
                disabled={loading}
                className="rounded-full border border-[#C1443C]/40 px-5 py-2.5 font-manrope text-sm text-[#C1443C] disabled:opacity-40"
              >
                Tolak
              </button>
            </div>
            {error && <p className="font-manrope text-xs text-[#C1443C]">{error}</p>}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
