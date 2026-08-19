import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface ActiveCommunity {
  communities_id: number;
  community_name: string;
  role?: string | null;
  status: string;
  is_active: boolean;
}

interface PageProps extends Record<string, any> {
  active_community?: ActiveCommunity | null;
}

export default function CommunityStatusAlert() {
  const { active_community } = usePage<PageProps>().props;

  /*
   * Tidak ada komunitas
   */
  if (!active_community) {
    return null;
  }

  /*
   * Komunitas masih aktif
   */
  if (active_community.status === 'Active') {
    return null;
  }

  /*
   * Komunitas tidak aktif
   */
  return (
    <section className="mb-6 rounded-xl border border-[#C1443C]/40 bg-[#C1443C]/10 p-5">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="mt-0.5 rounded-full bg-[#C1443C]/15 p-2 text-[#C1443C]">
          <AlertTriangle size={18} />
        </div>

        {/* Content */}
        <div className="min-w-0">
          <h2 className="font-manrope text-sm font-semibold text-[#F3EEE2]">
            Komunitas Sedang Tidak Aktif
          </h2>

          <p className="mt-1 font-manrope text-sm leading-relaxed text-[#9C93A8]">
            Komunitas{' '}
            <span className="font-medium text-[#F3EEE2]">
              "{active_community.community_name}"
            </span>{' '}
            sedang dinonaktifkan oleh Admin.
          </p>

          <p className="mt-2 font-manrope text-xs leading-relaxed text-[#75708A]">
            Fitur Main Quest, Daily Mission, Challenge, Forum,
            Leaderboard, dan pengelolaan komunitas sementara tidak tersedia.
          </p>
        </div>
      </div>
    </section>
  );
}