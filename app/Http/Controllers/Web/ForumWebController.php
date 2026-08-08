<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Concerns\ResolvesActiveCommunity;
use App\Http\Controllers\Controller;
use App\Models\ForumPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ForumWebController extends Controller
{
    use ResolvesActiveCommunity;

    /**
     * Mirror App\Http\Controllers\Api\ForumPostController::index, dengan
     * dukungan sort Newest/Popular sesuai CLAUDE.md.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $membership = $this->activeMembership($user);

        if (! $membership) {
            return redirect()->route('communities.index')
                ->with('error', 'Gabung ke sebuah komunitas dulu untuk membuka Forum.');
        }

        $community = $membership->community;
        $sort = $request->string('sort', 'newest');

        $query = $community->forumPosts()
            ->where('status', 'Published')
            ->with('user');

        $posts = match ((string) $sort) {
            'popular' => $query->orderByDesc('total_like'),
            default => $query->latest(),
        };

        return Inertia::render('Forum/Index', [
            'community' => $community,
            'posts' => $posts->paginate(10)->withQueryString(),
            'sort' => (string) $sort,
        ]);
    }

    public function show(Request $request, ForumPost $forumPost): Response
    {
        $user = $request->user();

        $forumPost->load([
            'community',
            'user',
            'comments' => fn ($q) => $q->whereNull('parent_id')->with(['user', 'replies.user']),
        ]);

        $liked = $forumPost->likes()->where('user_id', $user->users_id)->exists();

        return Inertia::render('Forum/Show', [
            'post' => $forumPost,
            'likedByMe' => $liked,
            'currentUserId' => $user->users_id,
        ]);
    }
}
