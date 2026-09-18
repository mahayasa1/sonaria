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
  communityRole: string;
}) {
  const total = practiceSubmissions.length + challengeSubmissions.length;

  return (
    <AppLayout title="Review Submission" role="Member" communityRole={communityRole} communityName={community.community_name}>
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#8D89B0]">
          {community.community_name}
        </p>
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#EDE9FE]">
          <ShieldCheck size={24} className="text-[#8B5CF6]" /> Review Submission
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
              <h2 className="mb-2 font-manrope text-xs uppercase tracking-[0.14em] text-[#8D89B0]">
                Practice ({practiceSubmissions.length})
              </h2>
              <div className="space-y-2">
                {practiceSubmissions.map((s) => (
                  <Link
                    key={s.practice_submissions_id}
                    href={`/manage/practice-submissions/${s.practice_submissions_id}`}
                    className="flex items-center justify-between rounded-lg border border-[#312E81] bg-[#0A1128] px-5 py-3.5 hover:border-[#8B5CF6]/40"
                  >
                    <div className="flex items-center gap-3">
                      <Video size={16} className="text-[#F87171]" />
                      <div>
                        <p className="font-manrope text-sm text-[#EDE9FE]">{s.practice.title}</p>
                        <p className="font-manrope text-xs text-[#8D89B0]">oleh {s.user.name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {challengeSubmissions.length > 0 && (
            <section>
              <h2 className="mb-2 font-manrope text-xs uppercase tracking-[0.14em] text-[#8D89B0]">
                Challenge ({challengeSubmissions.length})
              </h2>
              <div className="space-y-2">
                {challengeSubmissions.map((s) => (
                  <Link
                    key={s.challenge_submissions_id}
                    href={`/manage/challenge-submissions/${s.challenge_submissions_id}`}
                    className="flex items-center justify-between rounded-lg border border-[#312E81] bg-[#0A1128] px-5 py-3.5 hover:border-[#8B5CF6]/40"
                  >
                    <div className="flex items-center gap-3">
                      <Trophy size={16} className="text-[#8B5CF6]" />
                      <div>
                        <p className="font-manrope text-sm text-[#EDE9FE]">{s.challenge.title}</p>
                        <p className="font-manrope text-xs text-[#8D89B0]">oleh {s.user.name}</p>
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
