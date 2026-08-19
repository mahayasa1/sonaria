<?php

namespace App\Http\Middleware;

use App\Models\Community;
use App\Models\CommunityMember;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCommunityIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
    
        if (! $user) {
            return $next($request);
        }
    
        $user->loadMissing('role');
    
        if ($user->role?->role_name === 'Admin') {
            return $next($request);
        }
    
        $community = $this->resolveCommunity($request, $user);
    
        if ($community && $community->status !== 'Active') {
            $message = sprintf(
                'Komunitas "%s" sedang dinonaktifkan oleh Admin. Konten komunitas tidak dapat diakses sementara waktu.',
                $community->community_name
            );
    
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => $message,
                    'community' => $community->community_name,
                    'status' => $community->status,
                ], 403);
            }
    
            return redirect()
                ->route('dashboard')
                ->with('error', $message)
                ->with('community_inactive', true);
        }
    
        return $next($request);
    }

    protected function resolveCommunity(Request $request, $user): ?Community
    {
        $boundCommunity = $request->route('community');

        if ($boundCommunity instanceof Community) {
            return $boundCommunity;
        }

        $membership = CommunityMember::with('community')
            ->where('user_id', $user->users_id)
            ->where('status', 'Active')
            ->latest('join_date')
            ->first();

        return $membership?->community;
    }
}