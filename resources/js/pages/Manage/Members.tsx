import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Users } from 'lucide-react';

interface Member {
  community_members_id: number;
  join_date: string;
  user: { name: string; username: string; total_xp: number };
  role: { role_name: string };
}

export default function Members({
  community,
  members,
}: {
  community: { community_name: string };
  members: Member[];
}) {
  return (
    <AppLayout title="Kelola Member" role="Member" communityName={community.community_name}>
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
          {community.community_name}
        </p>
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <Users size={24} className="text-[#4C8C86]" /> Member ({members.length})
        </h1>
      </header>

      <section className="mt-6 divide-y divide-[#2A2333] overflow-hidden rounded-xl border border-[#2A2333] bg-[#1E1826]">
        {members.map((m) => (
          <div key={m.community_members_id} className="flex items-center justify-between px-5 py-3.5">
            <div>
              <p className="font-manrope text-sm text-[#F3EEE2]">{m.user.name}</p>
              <p className="font-manrope text-xs text-[#75708A]">
                @{m.user.username} · gabung {new Date(m.join_date).toLocaleDateString('id-ID')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-[#D9A441]">{m.user.total_xp} XP</span>
              <span className="rounded-full bg-white/5 px-3 py-1 font-manrope text-[11px] text-[#B7AFC2]">
                {m.role.role_name}
              </span>
            </div>
          </div>
        ))}
      </section>

      <p className="mt-4 font-manrope text-xs text-[#75708A]">
        Ubah role / keluarkan member belum tersedia — menunggu endpoint API terkait.
      </p>
    </AppLayout>
  );
}
