import React, { useState } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { apiFetch, ApiError } from '@/lib/api';
import { Users, Loader2 } from 'lucide-react';

interface Member {
  community_members_id: number;
  join_date: string;
  user: { users_id: number; name: string; username: string; total_xp: number };
  role: { role_name: string };
}

const ASSIGNABLE_ROLES = ['Member', 'Staff', 'Wakil Ketua', 'Ketua'];

function MemberRow({
  member,
  community,
  canManageMembers,
  currentUserId,
  onChanged,
}: {
  member: Member;
  community: { communities_id: number };
  canManageMembers: boolean;
  currentUserId: number;
  onChanged: (updated: Member | { removed: number }) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeRole = async (roleName: string) => {
    if (roleName === member.role.role_name) return;
    if (roleName === 'Ketua' && !confirm('Transfer kepemimpinan komunitas ke member ini?')) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await apiFetch<Member>(
        `/api/communities/${community.communities_id}/members/${member.community_members_id}`,
        { method: 'PUT', body: JSON.stringify({ role_name: roleName }) },
      );
      onChanged(updated);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal mengubah role.');
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Keluarkan ${member.user.name} dari komunitas?`)) return;
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/api/communities/${community.communities_id}/members/${member.community_members_id}`, {
        method: 'DELETE',
      });
      onChanged({ removed: member.community_members_id });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal mengeluarkan member.');
    } finally {
      setLoading(false);
    }
  };

  const isSelf = member.user.users_id === currentUserId;

  return (
    <div className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-manrope text-sm text-[#F3EEE2]">
          {member.user.name} {isSelf && <span className="text-[#75708A]">(kamu)</span>}
        </p>
        <p className="font-manrope text-xs text-[#75708A]">
          @{member.user.username} · gabung {new Date(member.join_date).toLocaleDateString('id-ID')}
        </p>
        {error && <p className="mt-1 font-manrope text-xs text-[#C1443C]">{error}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-[#D9A441]">{member.user.total_xp} XP</span>

        {canManageMembers && !isSelf ? (
          <select
            value={member.role.role_name}
            onChange={(e) => changeRole(e.target.value)}
            disabled={loading}
            className="rounded-full border border-[#2A2333] bg-[#14101B] px-3 py-1 font-manrope text-[11px] text-[#B7AFC2] focus:border-[#D9A441]/50 focus:outline-none disabled:opacity-50"
          >
            {ASSIGNABLE_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        ) : (
          <span className="rounded-full bg-white/5 px-3 py-1 font-manrope text-[11px] text-[#B7AFC2]">
            {member.role.role_name}
          </span>
        )}

        {canManageMembers && !isSelf && member.role.role_name !== 'Ketua' && (
          <button
            onClick={remove}
            disabled={loading}
            className="flex items-center gap-1 rounded-full border border-[#C1443C]/40 px-3 py-1 font-manrope text-[11px] text-[#C1443C] disabled:opacity-50"
          >
            {loading && <Loader2 size={11} className="animate-spin" />}
            Keluarkan
          </button>
        )}
      </div>
    </div>
  );
}

export default function Members({
  community,
  members,
  canManageMembers,
  currentUserId,
  communityRole,
}: {
  community: { communities_id: number; community_name: string };
  members: Member[];
  canManageMembers: boolean;
  currentUserId: number;
  communityRole?: string | null;
}) {
  const [list, setList] = useState(members);

  const handleChanged = (result: Member | { removed: number }) => {
    if ('removed' in result) {
      setList((prev) => prev.filter((m) => m.community_members_id !== result.removed));
    } else {
      setList((prev) =>
        prev.map((m) => (m.community_members_id === result.community_members_id ? result : m)),
      );
    }
  };

  return (
    <AppLayout title="Kelola Member" role="Member" communityRole={communityRole} communityName={community.community_name}>
      <header>
        <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
          {community.community_name}
        </p>
        <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
          <Users size={24} className="text-[#4C8C86]" /> Member ({list.length})
        </h1>
      </header>

      <section className="mt-6 divide-y divide-[#2A2333] overflow-hidden rounded-xl border border-[#2A2333] bg-[#1E1826]">
        {list.map((m) => (
          <MemberRow
            key={m.community_members_id}
            member={m}
            community={community}
            canManageMembers={canManageMembers}
            currentUserId={currentUserId}
            onChanged={handleChanged}
          />
        ))}
      </section>

      {!canManageMembers && (
        <p className="mt-4 font-manrope text-xs text-[#75708A]">
          Hanya Ketua/Wakil Ketua yang bisa mengubah role atau mengeluarkan member.
        </p>
      )}
    </AppLayout>
  );
}
