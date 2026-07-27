<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\ForumPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ForumPostController extends Controller
{
    /**
     * Forum diskusi komunitas, tampil di bawah Daily Mission & Challenge.
     */
    public function index(Community $community): JsonResponse
    {
        return response()->json(
            $community->forumPosts()
                ->where('status', 'Published')
                ->with('user')
                ->latest()
                ->paginate(10)
        );
    }

    public function show(ForumPost $forumPost): JsonResponse
    {
        return response()->json(
            $forumPost->load(['user', 'comments' => fn ($q) => $q->whereNull('parent_id')->with(['user', 'replies.user'])])
        );
    }

    public function store(Request $request, Community $community): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'content' => ['required', 'string'],
            'image' => ['nullable', 'string', 'max:255'],
        ]);

        $post = $community->forumPosts()->create([
            ...$data,
            'user_id' => $request->user()->users_id,
            'total_like' => 0,
            'total_comment' => 0,
            'status' => 'Published',
        ]);

        return response()->json($post, 201);
    }

    public function update(Request $request, ForumPost $forumPost): JsonResponse
    {
        $this->authorizeOwner($request, $forumPost);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:200'],
            'content' => ['sometimes', 'string'],
            'image' => ['nullable', 'string', 'max:255'],
        ]);

        $forumPost->update($data);

        return response()->json($forumPost);
    }

    public function destroy(Request $request, ForumPost $forumPost): JsonResponse
    {
        $this->authorizeOwner($request, $forumPost);

        $forumPost->update(['status' => 'Deleted']);

        return response()->json(['message' => 'Post dihapus.']);
    }

    /**
     * Like / unlike toggle.
     */
    public function toggleLike(Request $request, ForumPost $forumPost): JsonResponse
    {
        $user = $request->user();
        $like = $forumPost->likes()->where('user_id', $user->users_id)->first();

        if ($like) {
            $like->delete();
            $forumPost->decrement('total_like');
            $liked = false;
        } else {
            $forumPost->likes()->create(['user_id' => $user->users_id]);
            $forumPost->increment('total_like');
            $liked = true;
        }

        return response()->json(['liked' => $liked, 'total_like' => $forumPost->fresh()->total_like]);
    }

    protected function authorizeOwner(Request $request, ForumPost $post): void
    {
        abort_unless($post->user_id === $request->user()->users_id, 403, 'Kamu tidak berhak mengubah post ini.');
    }
}
