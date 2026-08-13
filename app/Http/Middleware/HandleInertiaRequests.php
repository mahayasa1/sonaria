<?php

namespace App\Http\Middleware;

use App\Models\CommunityMember;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            // Dibagikan secara global (bukan per-controller) supaya elemen UI
            // yang bergantung pada komunitas aktif user — tombol "Keluar
            // Komunitas" di Sidebar, dsb. — selalu muncul di halaman manapun,
            // bukan cuma di halaman yang kebetulan mengirim prop ini secara
            // manual.
            'activeCommunity' => $this->resolveActiveCommunity($request),
        ];
    }

    protected function resolveActiveCommunity(Request $request): ?array
    {
        $user = $request->user();

        if (! $user) {
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

        return [
            'communities_id' => $membership->community->communities_id,
            'community_name' => $membership->community->community_name,
            'role' => $membership->role?->role_name,
        ];
    }
}
