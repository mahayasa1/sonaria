<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->notifications()->latest()->paginate(20)
        );
    }

    public function markRead(Request $request, Notification $notification): JsonResponse
    {
        abort_unless($notification->user_id === $request->user()->users_id, 403);

        $notification->update(['is_read' => true, 'read_at' => now()]);

        return response()->json($notification);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->notifications()->where('is_read', false)->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json(['message' => 'Semua notifikasi ditandai sudah dibaca.']);
    }
}
