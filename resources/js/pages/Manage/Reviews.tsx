import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import EmptyState from '@/components/EmptyState';
import { ShieldCheck, Video, Trophy } from 'lucide-react';

interface PracticeSubmission {
  practice_submissions_id: number;
  submitted_at: string;
  user: { name: string };
  practice: { title: string };
}
interface ChallengeSubmission {
  challenge_submissions_id: number;
  submitted_at: string;
  user: { name: string };
  challenge: { title: string };
}

export default function Reviews({
  community,
  practiceSubmissions,
  challengeSubmissions,
  communityRole,
}: {
  community: { community_name: string };
  practiceSubmissions: PracticeSubmission[];
  challengeSubmissions: ChallengeSubmission[];
  communityRole?: string | null;
}) {
  const total = practiceSubmissions.length + challengeSubmissions.length;

  return (
    <AppLayout title="Review Submission" role="Member" communityRole={communityRole} communityName={community.community_name}>
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
          {community.community_name}
        </p>
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <ShieldCheck size={24} className="text-[#D9A441]" /> Review Submission
        </h1>
      </header>

      {total === 0 ? (
        <div className="mt-8">
          <EmptyState icon={ShieldCheck} title="Semua submission sudah direview" />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {practiceSubmissions.length > 0 && (
            <section>
              <h2 className="mb-2 font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
                Practice ({practiceSubmissions.length})
              </h2>
              <div className="space-y-2">
                {practiceSubmissions.map((s) => (
                  <Link
                    key={s.practice_submissions_id}
                    href={`/manage/practice-submissions/${s.practice_submissions_id}`}
                    className="flex items-center justify-between rounded-lg border border-[#2A2333] bg-[#1E1826] px-5 py-3.5 hover:border-[#D9A441]/40"
                  >
                    <div className="flex items-center gap-3">
                      <Video size={16} className="text-[#C1443C]" />
                      <div>
                        <p className="font-manrope text-sm text-[#F3EEE2]">{s.practice.title}</p>
                        <p className="font-manrope text-xs text-[#75708A]">oleh {s.user.name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {challengeSubmissions.length > 0 && (
            <section>
              <h2 className="mb-2 font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
                Challenge ({challengeSubmissions.length})
              </h2>
              <div className="space-y-2">
                {challengeSubmissions.map((s) => (
                  <Link
                    key={s.challenge_submissions_id}
                    href={`/manage/challenge-submissions/${s.challenge_submissions_id}`}
                    className="flex items-center justify-between rounded-lg border border-[#2A2333] bg-[#1E1826] px-5 py-3.5 hover:border-[#D9A441]/40"
                  >
                    <div className="flex items-center gap-3">
                      <Trophy size={16} className="text-[#D9A441]" />
                      <div>
                        <p className="font-manrope text-sm text-[#F3EEE2]">{s.challenge.title}</p>
                        <p className="font-manrope text-xs text-[#75708A]">oleh {s.user.name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </AppLayout>
  );
}
