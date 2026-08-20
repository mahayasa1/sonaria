<?php

namespace App\Http\Middleware;

use App\Models\CommunityMember;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'community_inactive' => fn () =>
                    $request->session()->get('community_inactive'),
            ],

            'activeCommunity' => fn () => $this->resolveActiveCommunity($request),
        ];
    }

    protected function resolveActiveCommunity(Request $request): ?array
    {
        $user = $request->user();

        if (! $user) {
            return null;
        }

        $user->loadMissing('role');

        if ($user->role?->role_name === 'Admin') {
            return null;
        }

        $membership = CommunityMember::with(['community', 'role'])
            ->where('user_id', $user->users_id)
            ->where('status', 'Active')
            ->latest('join_date')
            ->first();

        if (! $membership || ! $membership->community) {
            return null;
        }

        $community = $membership->community;

        return [
            'communities_id' => $community->communities_id,
            'community_name' => $community->community_name,
            'role' => $membership->role?->role_name,
            'status' => $community->status,
            'is_active' => $community->status === 'Active',
        ];
    }
}