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
     */
    public function review(User $user, Community $community): bool
    {
        return $this->manage($user, $community);
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
