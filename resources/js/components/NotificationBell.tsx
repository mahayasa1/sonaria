import React, { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { PIXEL_CLIP } from '@/components/quest/quest-ui';

interface NotificationItem {
  notifications_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface Paginated<T> {
  data: T[];
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = items.filter((n) => !n.is_read).length;

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<Paginated<NotificationItem>>('/api/notifications');
      setItems(res.data);
      setLoaded(true);
    } catch {
      // biarkan silent, bell tetap bisa dibuka kosong
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ambil notifikasi sekali di awal supaya badge unread langsung akurat,
    // tanpa perlu user membuka dropdown dulu.
    load();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = () => {
    setOpen((v) => !v);
    if (!loaded) load();
  };

  const markRead = async (id: number) => {
    setItems((prev) => prev.map((n) => (n.notifications_id === id ? { ...n, is_read: true } : n)));
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: 'POST' });
    } catch {
      // biarkan, state UI sudah optimistik
    }
  };

  const markAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await apiFetch('/api/notifications/read-all', { method: 'POST' });
    } catch {
      // biarkan
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggle}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-[#93C5FD] transition-colors hover:border-[#38BDF8]/40 hover:text-[#38BDF8]"
        aria-label="Notifikasi"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#F87171] px-1 font-[var(--font-pixel-mono)] text-[9px] text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-80"
          style={{ clipPath: PIXEL_CLIP, backgroundColor: 'rgba(255,255,255,0.18)', padding: 2 }}
        >
          <div
            className="h-full w-full"
            style={{ clipPath: PIXEL_CLIP, backgroundColor: 'rgba(6,10,25,0.92)' }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="font-[var(--font-pixel-mono)] text-sm text-[#F3EEE2]">Notifikasi</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 font-[var(--font-pixel-mono)] text-[11px] text-[#4ADE80] hover:underline"
                >
                  <CheckCheck size={12} /> Tandai semua dibaca
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading && !loaded ? (
                <div className="flex items-center justify-center py-8 text-[#93C5FD]/50">
                  <Loader2 size={16} className="animate-spin" />
                </div>
              ) : items.length === 0 ? (
                <p className="px-4 py-8 text-center font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/50">
                  Belum ada notifikasi.
                </p>
              ) : (
                items.map((n) => (
                  <button
                    key={n.notifications_id}
                    onClick={() => !n.is_read && markRead(n.notifications_id)}
                    className={`block w-full border-b border-white/10 px-4 py-3 text-left last:border-b-0 ${
                      n.is_read ? 'opacity-60' : 'bg-[#38BDF8]/5'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.is_read && (
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8]" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-[var(--font-pixel-mono)] text-xs text-[#F3EEE2]">{n.title}</p>
                        <p className="mt-0.5 font-[var(--font-pixel-mono)] text-xs text-[#93C5FD]/60">
                          {n.message}
                        </p>
                        <p className="mt-1 font-[var(--font-pixel-mono)] text-[10px] text-[#93C5FD]/50">
                          {new Date(n.created_at).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}