import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Users, ShieldCheck, Swords, Flame, Trophy, Check, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';

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
    <div className="mt-6 space-y-6">
      {canCreateContent && (
        <section className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
          <h2 className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
            Buat Konten Baru
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link
              href="/manage/main-quests/create"
              className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-3 font-manrope text-sm text-[#F3EEE2] hover:bg-white/10"
            >
              <Swords size={16} className="text-[#D9A441]" /> Main Quest
            </Link>
            <Link
              href="/manage/daily-missions"
              className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-3 font-manrope text-sm text-[#F3EEE2] hover:bg-white/10"
            >
              <Flame size={16} className="text-[#C1443C]" /> Daily Mission
            </Link>
            <Link
              href="/manage/challenges"
              className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-3 font-manrope text-sm text-[#F3EEE2] hover:bg-white/10"
            >
              <Trophy size={16} className="text-[#D9A441]" /> Challenge
            </Link>
          </div>
        </section>
      )}

      {canModerate && (
        <>
          <section className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
            <div className="flex items-center gap-2 text-[#4C8C86]">
              <Users size={18} />
              <h2 className="font-manrope text-sm">Permintaan Bergabung</h2>
              <span className="ml-auto font-mono text-xs text-[#75708A]">
                {joinRequests.length} pending
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {joinRequests.length === 0 && (
                <p className="font-manrope text-sm text-[#75708A]">Tidak ada permintaan yang menunggu.</p>
              )}
              {joinRequests.map((req) => (
                <div
                  key={req.community_join_requests_id}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2.5"
                >
                  <span className="font-manrope text-sm text-[#F3EEE2]">{req.user.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approve(req.community_join_requests_id)}
                      className="rounded-full bg-[#4C8C86]/20 p-1.5 text-[#4C8C86] hover:bg-[#4C8C86]/30"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => reject(req.community_join_requests_id)}
                      className="rounded-full bg-[#C1443C]/20 p-1.5 text-[#C1443C] hover:bg-[#C1443C]/30"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
            <div className="flex items-center gap-2 text-[#D9A441]">
              <ShieldCheck size={18} />
              <h2 className="font-manrope text-sm">Submission Menunggu Review</h2>
              <span className="ml-auto font-mono text-xs text-[#75708A]">
                {pendingSubmissions.length} pending
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {pendingSubmissions.length === 0 && (
                <p className="font-manrope text-sm text-[#75708A]">Semua submission sudah direview.</p>
              )}
              {pendingSubmissions.map((sub) => (
                <Link
                  key={sub.id}
                  href={sub.reviewUrl}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2.5 hover:bg-white/10"
                >
                  <div>
                    <p className="font-manrope text-sm text-[#F3EEE2]">{sub.title}</p>
                    <p className="font-manrope text-xs text-[#75708A]">oleh {sub.user.name}</p>
                  </div>
                  <span className="font-manrope text-xs text-[#D9A441]">{sub.type}</span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
