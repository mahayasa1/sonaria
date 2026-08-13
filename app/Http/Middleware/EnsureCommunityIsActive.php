<?php

namespace App\Http\Middleware;

use App\Models\Community;
use App\Models\CommunityMember;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Sebelumnya admin bisa toggle status komunitas jadi "Inactive" dari panel
 * admin, tapi tidak ada satupun pengecekan di sisi member — member yang
 * sudah gabung tetap bebas akses Main Quest/Daily Mission/Challenge/Forum/
 * Leaderboard/Manage komunitas itu seperti biasa (TC-ADC-002).
 *
 * Middleware ini menutup celah itu dengan mengecek status komunitas dari:
 * 1. Route-model-binding `{community}` kalau route-nya eksplisit menyebut
 *    komunitas (dipakai di routes/api.php), atau
 * 2. Keanggotaan aktif user (dipakai di routes/web.php untuk halaman yang
 *    tidak menyebut community_id di URL — main-quests, daily-missions, dst
 *    — resolusinya sama seperti App\Http\Controllers\Concerns\ResolvesActiveCommunity).
 *
 * Admin sendiri tidak pernah diblokir oleh middleware ini (mereka yang
 * mengatur status komunitas, jadi harus tetap bisa masuk untuk keperluan
 * moderasi).
 */
class EnsureCommunityIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        if ($user->role?->role_name === 'Admin') {
            return $next($request);
        }

        $community = $this->resolveCommunity($request, $user);

        if ($community && $community->status !== 'Active') {
            $message = "Komunitas \"{$community->community_name}\" sedang dinonaktifkan oleh Admin. Konten tidak bisa diakses sementara waktu.";

            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['message' => $message], 403);
            }

            return redirect()->route('communities.index')->with('error', $message);
        }

        return $next($request);
    }

    protected function resolveCommunity(Request $request, $user): ?Community
    {
        $bound = $request->route('community');

        if ($bound instanceof Community) {
            return $bound;
        }

        $membership = CommunityMember::with('community')
            ->where('user_id', $user->users_id)
            ->where('status', 'Active')
            ->latest('join_date')
            ->first();

        return $membership?->community;
    }
}
