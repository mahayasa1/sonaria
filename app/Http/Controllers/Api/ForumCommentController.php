<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ForumPost;
use App\Models\ForumComment;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ForumCommentController extends Controller
{
    public function __construct(protected NotificationService $notifications)
    {
    }

    /**
     * Tambah komentar (atau balasan jika parent_id diisi).
     */
    public function store(Request $request, ForumPost $forumPost): JsonResponse
    {
        $data = $request->validate([
            'comment' => ['required', 'string'],
            'parent_id' => ['nullable', 'exists:forum_comments,forum_comments_id'],
        ]);

        $comment = $forumPost->comments()->create([
            ...$data,
            'user_id' => $request->user()->users_id,
            'status' => 'Active',
        ]);

        $forumPost->increment('total_comment');

        $author = $request->user();
        $notified = [(int) $author->users_id];

        if (! empty($data['parent_id'])) {
            $parent = ForumComment::find($data['parent_id']);

            if ($parent && ! in_array((int) $parent->user_id, $notified, true)) {
                $this->notifications->send(
                    $parent->user_id,
                    NotificationService::TYPE_FORUM,
                    'Balasan baru',
                    "{$author->name} membalas komentarmu di post \"{$forumPost->title}\".",
                    $forumPost,
                );
                $notified[] = (int) $parent->user_id;
            }
        }

        if (! in_array((int) $forumPost->user_id, $notified, true)) {
            $this->notifications->send(
                $forumPost->user_id,
                NotificationService::TYPE_FORUM,
                'Komentar baru',
                "{$author->name} berkomentar di post \"{$forumPost->title}\".",
                $forumPost,
            );
        }

        return response()->json($comment->load('user'), 201);
    }

    public function destroy(Request $request, ForumComment $forumComment): JsonResponse
    {
        abort_unless($forumComment->user_id === $request->user()->users_id, 403, 'Kamu tidak berhak menghapus komentar ini.');

        $forumComment->update(['status' => 'Deleted']);
        $forumComment->post()->decrement('total_comment');

        return response()->json(['message' => 'Komentar dihapus.']);
    }
}
