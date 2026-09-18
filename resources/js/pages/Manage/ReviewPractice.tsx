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

export default function ReviewPractice({ submission }: { submission: Submission }) {
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
    <AppLayout title="Review Practice" role="Member" communityName={communityName}>
      <Link href="/dashboard" className="flex items-center gap-1.5 font-manrope text-xs text-[#8D89B0] hover:text-[#EDE9FE]">
        <ArrowLeft size={14} /> Kembali ke Dashboard
      </Link>

      <header className="mt-3">
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#EDE9FE]">
          <Video size={24} className="text-[#F87171]" /> {submission.practice.title}
        </h1>
        <p className="mt-1 font-manrope text-sm text-[#8D89B0]">
          oleh {submission.user.name} (@{submission.user.username})
        </p>
      </header>

      <section className="mt-6 rounded-xl border border-[#312E81] bg-[#0A1128] p-6">
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#8D89B0]">Video Latihan</p>
        <a
          href={submission.video_path}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block break-all font-manrope text-sm text-[#8B5CF6] underline"
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
              <label className="font-manrope text-xs text-[#8D89B0]">
                Skor (minimal lulus: {submission.practice.minimum_score})
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-manrope text-xs text-[#8D89B0]">Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-[#312E81] bg-[#020617] px-3 py-2 font-manrope text-sm text-[#EDE9FE] focus:border-[#8B5CF6]/50 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => submit('Approved')}
                disabled={loading}
                className="flex items-center gap-2 rounded-full bg-[#4C8C86] px-5 py-2.5 font-manrope text-sm text-[#020617] disabled:opacity-40"
              >
                {loading && <Loader2 size={14} className="animate-spin" />} Setujui
              </button>
              <button
                onClick={() => submit('Revision')}
                disabled={loading}
                className="rounded-full border border-[#8B5CF6]/40 px-5 py-2.5 font-manrope text-sm text-[#8B5CF6] disabled:opacity-40"
              >
                Minta Revisi
              </button>
              <button
                onClick={() => submit('Rejected')}
                disabled={loading}
                className="rounded-full border border-[#F87171]/40 px-5 py-2.5 font-manrope text-sm text-[#F87171] disabled:opacity-40"
              >
                Tolak
              </button>
            </div>
            {error && <p className="font-manrope text-xs text-[#F87171]">{error}</p>}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
