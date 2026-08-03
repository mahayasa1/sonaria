import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import EmptyState from '@/components/EmptyState';
import { apiFetch, ApiError } from '@/lib/api';
import { MessageSquare, Heart, Plus, X, Loader2 } from 'lucide-react';

interface Post {
  forum_posts_id: number;
  title: string;
  content: string;
  total_like: number;
  total_comment: number;
  created_at: string;
  user: { name: string };
}

interface Paginated<T> {
  data: T[];
  links: { url: string | null; label: string; active: boolean }[];
}

function NewPostModal({
  communityId,
  onClose,
  onCreated,
}: {
  communityId: number;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/api/communities/${communityId}/forum-posts`, {
        method: 'POST',
        body: JSON.stringify({ title, content }),
      });
      onCreated();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal membuat diskusi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border border-[#2A2333] bg-[#1E1826] p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-fraunces text-xl text-[#F3EEE2]">Diskusi Baru</h3>
          <button onClick={onClose} className="text-[#75708A] hover:text-[#F3EEE2]">
            <X size={18} />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul diskusi"
            className="w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis pertanyaan atau topik diskusimu..."
            rows={5}
            className="w-full rounded-lg border border-[#2A2333] bg-[#14101B] px-3 py-2 font-manrope text-sm text-[#F3EEE2] placeholder:text-[#75708A] focus:border-[#D9A441]/50 focus:outline-none"
          />
          <button
            onClick={submit}
            disabled={loading || !title || !content}
            className="flex items-center gap-2 rounded-full bg-[#D9A441] px-5 py-2.5 font-manrope text-sm text-[#14101B] disabled:opacity-40"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Posting
          </button>
          {error && <p className="font-manrope text-xs text-[#C1443C]">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Index({
  community,
  posts,
  sort,
}: {
  community: { communities_id: number; community_name: string };
  posts: Paginated<Post>;
  sort: string;
}) {
  const [creating, setCreating] = useState(false);

  return (
    <AppLayout title="Forum" role="Member" communityName={community.community_name}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-manrope text-xs uppercase tracking-[0.14em] text-[#75708A]">
            {community.community_name}
          </p>
          <h1 className="flex items-center gap-2 font-fraunces text-3xl text-[#F3EEE2]">
            <MessageSquare size={24} className="text-[#4C8C86]" /> Forum
          </h1>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 rounded-full bg-[#D9A441] px-4 py-2.5 font-manrope text-sm text-[#14101B]"
        >
          <Plus size={15} /> Diskusi Baru
        </button>
      </header>

      <div className="mt-5 flex gap-2">
        {[
          { key: 'newest', label: 'Terbaru' },
          { key: 'popular', label: 'Populer' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => router.get('/forum', { sort: s.key }, { preserveState: true })}
            className={`rounded-full border px-4 py-1.5 font-manrope text-xs ${
              sort === s.key
                ? 'border-[#D9A441] bg-[#D9A441]/12 text-[#D9A441]'
                : 'border-[#2A2333] text-[#B7AFC2]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {posts.data.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={MessageSquare}
            title="Belum ada diskusi"
            description="Jadilah yang pertama memulai diskusi di komunitas ini."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {posts.data.map((post) => (
            <Link
              key={post.forum_posts_id}
              href={`/forum/${post.forum_posts_id}`}
              className="block rounded-xl border border-[#2A2333] bg-[#1E1826] p-5 transition-colors hover:border-[#4C8C86]/40"
            >
              <p className="font-fraunces text-lg text-[#F3EEE2]">{post.title}</p>
              <p className="mt-1 line-clamp-2 font-manrope text-sm text-[#B7AFC2]">{post.content}</p>
              <div className="mt-3 flex items-center gap-4 font-manrope text-xs text-[#75708A]">
                <span>oleh {post.user.name}</span>
                <span className="flex items-center gap-1">
                  <Heart size={12} /> {post.total_like}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} /> {post.total_comment}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {creating && (
        <NewPostModal
          communityId={community.communities_id}
          onClose={() => setCreating(false)}
          onCreated={() => router.reload()}
        />
      )}
    </AppLayout>
  );
}
