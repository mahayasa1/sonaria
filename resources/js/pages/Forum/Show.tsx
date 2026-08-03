import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { apiFetch, ApiError } from '@/lib/api';
import { ArrowLeft, Heart, Send, Loader2 } from 'lucide-react';

interface Comment {
  forum_comments_id: number;
  comment: string;
  created_at: string;
  user: { name: string };
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
  user: { name: string };
  comments: Comment[];
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div>
      <div className="rounded-lg bg-white/5 px-4 py-3">
        <p className="font-manrope text-sm text-[#F3EEE2]">{comment.comment}</p>
        <p className="mt-1 font-manrope text-xs text-[#75708A]">oleh {comment.user.name}</p>
      </div>
      {comment.replies?.length > 0 && (
        <div className="ml-6 mt-2 space-y-2 border-l border-[#2A2333] pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.forum_comments_id} className="rounded-lg bg-white/5 px-4 py-3">
              <p className="font-manrope text-sm text-[#F3EEE2]">{reply.comment}</p>
              <p className="mt-1 font-manrope text-xs text-[#75708A]">oleh {reply.user.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Show({ post, likedByMe }: { post: Post; likedByMe: boolean }) {
  const [liked, setLiked] = useState(likedByMe);
  const [totalLike, setTotalLike] = useState(post.total_like);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments);
  const [posting, setPosting] = useState(false);

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
      // tampilkan error sederhana
      if (e instanceof ApiError) alert(e.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <AppLayout title={post.title} role="Member" communityName={post.community.community_name}>
      <Link href="/forum" className="flex items-center gap-1.5 font-manrope text-xs text-[#75708A] hover:text-[#F3EEE2]">
        <ArrowLeft size={14} /> Kembali ke Forum
      </Link>

      <article className="mt-4 rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
        <h1 className="font-fraunces text-2xl text-[#F3EEE2]">{post.title}</h1>
        <p className="mt-1 font-manrope text-xs text-[#75708A]">
          oleh {post.user.name} · {new Date(post.created_at).toLocaleDateString('id-ID')}
        </p>
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
            <CommentItem key={c.forum_comments_id} comment={c} />
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
    </AppLayout>
  );
}
