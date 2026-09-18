import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Users, ShieldCheck, Swords, Flame, Trophy, Check, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { PixelPanel } from '@/components/quest/quest-ui';

interface JoinRequest {
  community_join_requests_id: number;
  user: { name: string };
}
interface PendingSubmission {
  id: number;
  title: string;
  user: { name: string };
  type: string;
  reviewUrl: string;
}

interface ManagerPanelProps {
  communityId: number;
  joinRequests?: JoinRequest[];
  pendingSubmissions?: PendingSubmission[];
  canCreateContent?: boolean;
  canModerate?: boolean;
}

/**
 * Panel pengelolaan komunitas, dipakai bersama oleh dashboard Ketua,
 * Wakil Ketua, dan Staff — bedanya hanya pada flag kapabilitas:
 *
 *  - canCreateContent: boleh membuat Main Quest / Daily Mission / Challenge
 *    baru (di Sonaria: khusus Ketua & Wakil Ketua).
 *  - canModerate: boleh menyetujui join request & mereview submission
 *    (Ketua, Wakil Ketua, maupun Staff yang diberi wewenang moderasi).
 */
export default function ManagerPanel({
  communityId,
  joinRequests = [],
  pendingSubmissions = [],
  canCreateContent = false,
  canModerate = true,
}: ManagerPanelProps) {
  async function approve(id: number) {
    await apiFetch(`/api/communities/${communityId}/join-requests/${id}/approve`, { method: 'POST' });
    router.reload();
  }

  async function reject(id: number) {
    await apiFetch(`/api/communities/${communityId}/join-requests/${id}/reject`, { method: 'POST' });
    router.reload();
  }

  return (
    <div className="space-y-6">
      {canCreateContent && (
        <PixelPanel>
          <div className="p-6">
            <h2 className="text-[10px] font-[var(--font-pixel)] uppercase tracking-[0.2em] text-[#93C5FD]">
              Buat Konten Baru
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Link
                href="/manage/main-quests/create"
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2] transition-colors hover:border-[#38BDF8]/30 hover:bg-white/[0.06]"
              >
                <Swords size={16} className="text-[#38BDF8]" /> Main Quest
              </Link>
              <Link
                href="/manage/daily-missions"
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2] transition-colors hover:border-[#F87171]/30 hover:bg-white/[0.06]"
              >
                <Flame size={16} className="text-[#F87171]" /> Daily Mission
              </Link>
              <Link
                href="/manage/challenges"
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2] transition-colors hover:border-[#FBBF24]/30 hover:bg-white/[0.06]"
              >
                <Trophy size={16} className="text-[#FBBF24]" /> Challenge
              </Link>
            </div>
          </div>
        </PixelPanel>
      )}

      {canModerate && (
        <>
          <PixelPanel>
            <div className="p-6">
              <div className="flex items-center gap-2 text-[#4ADE80]">
                <Users size={18} />
                <h2 className="text-[10px] font-[var(--font-pixel)] uppercase tracking-[0.2em]">
                  Permintaan Bergabung
                </h2>
                <span className="ml-auto font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/60">
                  {joinRequests.length} pending
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {joinRequests.length === 0 && (
                  <p className="font-[var(--font-pixel-mono)] text-sm text-[#93C5FD]/60">
                    Tidak ada permintaan yang menunggu.
                  </p>
                )}
                {joinRequests.map((req) => (
                  <div
                    key={req.community_join_requests_id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5"
                  >
                    <span className="font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2]">
                      {req.user.name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approve(req.community_join_requests_id)}
                        className="rounded-full bg-[#4ADE80]/15 p-1.5 text-[#4ADE80] hover:bg-[#4ADE80]/25"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => reject(req.community_join_requests_id)}
                        className="rounded-full bg-[#F87171]/15 p-1.5 text-[#F87171] hover:bg-[#F87171]/25"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PixelPanel>

          <PixelPanel>
            <div className="p-6">
              <div className="flex items-center gap-2 text-[#FBBF24]">
                <ShieldCheck size={18} />
                <h2 className="text-[10px] font-[var(--font-pixel)] uppercase tracking-[0.2em]">
                  Submission Menunggu Review
                </h2>
                <span className="ml-auto font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/60">
                  {pendingSubmissions.length} pending
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {pendingSubmissions.length === 0 && (
                  <p className="font-[var(--font-pixel-mono)] text-sm text-[#93C5FD]/60">
                    Semua submission sudah direview.
                  </p>
                )}
                {pendingSubmissions.map((sub) => (
                  <Link
                    key={sub.id}
                    href={sub.reviewUrl}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 transition-colors hover:border-[#FBBF24]/30 hover:bg-white/[0.06]"
                  >
                    <div>
                      <p className="font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2]">{sub.title}</p>
                      <p className="font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/60">
                        oleh {sub.user.name}
                      </p>
                    </div>
                    <span className="font-[var(--font-pixel-mono)] text-xs text-[#FBBF24]">
                      {sub.type}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </PixelPanel>
        </>
      )}
    </div>
  );
}