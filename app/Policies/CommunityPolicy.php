<?php

namespace App\Policies;

use App\Models\Community;
use App\Models\User;

class CommunityPolicy
{
    /**
     * Owner komunitas selalu boleh mengelola.
     */
    public function manage(User $user, Community $community): bool
    {
        if ($community->owner_id === $user->users_id) {
            return true;
        }

        return $this->hasManagingRole($user, $community);
    }

    /**
     * Boleh mereview submission (practice/challenge) di komunitas ini.
     * Berbeda dengan manage(): Staff juga diberi wewenang moderasi/review
     * (lihat menu "Challenge Review" & "Member Verification" di CLAUDE.md),
     * meski tidak boleh membuat Main Quest/Daily Mission/Challenge baru.
     */
    public function review(User $user, Community $community): bool
    {
        if ($this->manage($user, $community)) {
            return true;
        }

        return $community->members()
            ->where('user_id', $user->users_id)
            ->where('status', 'Active')
            ->whereHas('role', function ($query) {
                $query->where('role_name', 'Staff');
            })
            ->exists();
    }

    /**
     * Cek apakah user adalah Ketua / Wakil Ketua komunitas terkait.
     */
    protected function hasManagingRole(User $user, Community $community): bool
    {
        return $community->members()
            ->where('user_id', $user->users_id)
            ->where('status', 'Active')
            ->whereHas('role', function ($query) {
                $query->whereIn('role_name', ['Ketua', 'Wakil Ketua']);
            })
            ->exists();
    }
}
