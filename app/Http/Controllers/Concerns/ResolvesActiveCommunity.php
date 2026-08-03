<?php

namespace App\Http\Controllers\Concerns;

use App\Models\CommunityMember;
use App\Models\User;

/**
 * Sama seperti logika di DashboardController: user (untuk MVP) dianggap
 * aktif di satu komunitas — keanggotaan Active yang paling baru gabung.
 */
trait ResolvesActiveCommunity
{
    protected function activeMembership(User $user): ?CommunityMember
    {
        return CommunityMember::with(['community', 'role'])
            ->where('user_id', $user->users_id)
            ->where('status', 'Active')
            ->latest('join_date')
            ->first();
    }
}
