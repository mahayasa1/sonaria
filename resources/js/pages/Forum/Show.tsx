import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { apiFetch, ApiError } from '@/lib/api';
import { ArrowLeft, Heart, Send, Loader2, Pencil, Trash2, X } from 'lucide-react';

interface Comment {
  forum_comments_id: number;
  comment: string;
  created_at: string;
  user: { users_id: number; name: string };
  replies: Comment[];
}
interface Post {
  forum_posts_id: number;
  title: string;
  content: string;
  total_like: number;
  total_comment: number;
  created_at: string;
  community: { community_name: string };
  user: { users_id: number; name: string };
  comments: Comment[];
}

function CommentItem({
  comment,
  currentUserId,
  onDeleted,
}: {
  comment: Comment;
  currentUserId: number;
  onDeleted: (id: number) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    if (!confirm('Hapus komentar ini?')) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/forum-comments/${comment.forum_comments_id}`, { method: 'DELETE' });
      onDeleted(comment.forum_comments_id);
    } catch (e) {
      if (e instanceof ApiError) alert(e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="rounded-lg bg-white/5 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-manrope text-sm text-[#F3EEE2]">{comment.comment}</p>
            <p className="mt-1 font-manrope text-xs text-[#75708A]">oleh {comment.user.name}</p>
          </div>
          {comment.user.users_id === currentUserId && (
            <button
              onClick={remove}
              disabled={deleting}
              className="shrink-0 text-[#75708A] hover:text-[#C1443C] disabled:opacity-50"
              title="Hapus komentar"
            >
              {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            </button>
          )}
        </div>
      </div>
      {comment.replies?.length > 0 && (
        <div className="ml-6 mt-2 space-y-2 border-l border-[#2A2333] pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.forum_comments_id} className="rounded-lg bg-white/5 px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-manrope text-sm text-[#F3EEE2]">{reply.comment}</p>
                  <p className="mt-1 font-manrope text-xs text-[#75708A]">oleh {reply.user.name}</p>
                </div>
                {reply.user.users_id === currentUserId && (
                  <button
                    onClick={async () => {
                      if (!confirm('Hapus balasan ini?')) return;
                      try {
                        await apiFetch(`/api/forum-comments/${reply.forum_comments_id}`, { method: 'DELETE' });
                        onDeleted(reply.forum_comments_id);
                      } catch (e) {
                        if (e instanceof ApiError) alert(e.message);
                      }
                    }}
                    className="shrink-0 text-[#75708A] hover:text-[#C1443C]"
                    title="Hapus balasan"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EditPostModal({
  post,
  onClose,
  onSaved,
}: {
  post: Post;
  onClose: () => void;
  onSaved: (title: string, content: string) => void;
}) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/api/forum-posts/${post.forum_posts_id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content }),
      });
      onSaved(title, content);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal menyimpan perubahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-fraunces text-xl text-[#F3EEE2]">Edit Diskusi</h3>
          <button onClick={onClose} className="text-[#75708A] hover:text-[#F3EEE2]">
            <X size={18} />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] focus:border-[#D9A441]/50 focus:outline-none"
          />
          <button
            onClick={save}
            disabled={loading || !title || !content}
            className="flex items-center gap-2 rounded-full bg-[#D9A441] px-5 py-2.5 font-manrope text-sm text-[#14101B] disabled:opacity-40"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Simpan
          </button>
          {error && <p className="font-manrope text-xs text-[#C1443C]">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Show({
  post: initialPost,
  likedByMe,
  currentUserId,
}: {
  post: Post;
  likedByMe: boolean;
  currentUserId: number;
}) {
  const [post, setPost] = useState(initialPost);
  const [liked, setLiked] = useState(likedByMe);
  const [totalLike, setTotalLike] = useState(post.total_like);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments);
  const [posting, setPosting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  const isOwner = post.user.users_id === currentUserId;

  const toggleLike = async () => {
    try {
      const res = await apiFetch<{ liked: boolean; total_like: number }>(
        `/api/forum-posts/${post.forum_posts_id}/like`,
        { method: 'POST' },
      );
      setLiked(res.liked);
      setTotalLike(res.total_like);
    } catch {
      // abaikan, biarkan state lama
    }
  };

  const submitComment = async () => {
    if (!comment.trim()) return;
    setPosting(true);
    try {
      const created = await apiFetch<Comment>(`/api/forum-posts/${post.forum_posts_id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ comment }),
      });
      setComments((prev) => [...prev, { ...created, replies: [] }]);
      setComment('');
    } catch (e) {
      if (e instanceof ApiError) alert(e.message);
    } finally {
      setPosting(false);
    }
  };

  const removeComment = (id: number) => {
    setComments((prev) =>
      prev
        .filter((c) => c.forum_comments_id !== id)
        .map((c) => ({ ...c, replies: c.replies.filter((r) => r.forum_comments_id !== id) })),
    );
  };

  const deletePost = async () => {
    if (!confirm('Hapus diskusi ini? Tindakan ini tidak bisa dibatalkan.')) return;
    setDeletingPost(true);
    try {
      await apiFetch(`/api/forum-posts/${post.forum_posts_id}`, { method: 'DELETE' });
      router.visit('/forum');
    } catch (e) {
      if (e instanceof ApiError) alert(e.message);
      setDeletingPost(false);
    }
  };

  return (
    <AppLayout title={post.title} role="Member" communityName={post.community.community_name}>
      <Link href="/forum" className="flex items-center gap-1.5 font-manrope text-xs text-[#75708A] hover:text-[#F3EEE2]">
        <ArrowLeft size={14} /> Kembali ke Forum
      </Link>

      <article className="mt-4 rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-fraunces text-2xl text-[#F3EEE2]">{post.title}</h1>
            <p className="mt-1 font-manrope text-xs text-[#75708A]">
              oleh {post.user.name} · {new Date(post.created_at).toLocaleDateString('id-ID')}
            </p>
          </div>
          {isOwner && (
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1 rounded-full border border-[#2A2333] px-3 py-1.5 font-manrope text-xs text-[#B7AFC2] hover:border-[#D9A441]/40 hover:text-[#D9A441]"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={deletePost}
                disabled={deletingPost}
                className="flex items-center gap-1 rounded-full border border-[#C1443C]/40 px-3 py-1.5 font-manrope text-xs text-[#C1443C] disabled:opacity-50"
              >
                {deletingPost ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Hapus
              </button>
            </div>
          )}
        </div>
        <p className="mt-4 whitespace-pre-line font-manrope text-sm text-[#B7AFC2]">{post.content}</p>

        <button
          onClick={toggleLike}
          className={`mt-5 flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-manrope text-xs ${
            liked ? 'border-[#C1443C]/50 bg-[#C1443C]/12 text-[#C1443C]' : 'border-[#2A2333] text-[#B7AFC2]'
          }`}
        >
          <Heart size={13} fill={liked ? 'currentColor' : 'none'} /> {totalLike}
        </button>
      </article>

      <section className="mt-6">
        <h2 className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
          {comments.length} Komentar
        </h2>
        <div className="mt-3 space-y-3">
          {comments.map((c) => (
            <CommentItem
              key={c.forum_comments_id}
              comment={c}
              currentUserId={currentUserId}
              onDeleted={removeComment}
            />
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitComment()}
            placeholder="Tulis komentar..."
            className="flex-1 rounded-full border border-[#2A2333] bg-[#14101B] px-4 py-2.5 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
          />
          <button
            onClick={submitComment}
            disabled={posting || !comment.trim()}
            className="flex items-center gap-1.5 rounded-full bg-[#D9A441] px-4 py-2.5 font-manrope text-sm text-[#14101B] disabled:opacity-40"
          >
            {posting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      </section>

      {editing && (
        <EditPostModal
          post={post}
          onClose={() => setEditing(false)}
          onSaved={(title, content) => {
            setPost((prev) => ({ ...prev, title, content }));
            setEditing(false);
          }}
        />
      )}
    </AppLayout>
  );
}
