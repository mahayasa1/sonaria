<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ForumPost;
use App\Models\ForumComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ForumCommentController extends Controller
{
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
