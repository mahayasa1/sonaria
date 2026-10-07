<?php

namespace App\Services;

use App\Models\Community;
use App\Models\CommunityMember;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Satu-satunya pintu untuk membuat notifikasi in-app Sonaria (tabel
 * "notifications" yang dibaca NotificationBell lewat /api/notifications).
 * Semua event (review, level up, badge, forum, join komunitas, dst.) WAJIB
 * lewat sini supaya format & tipe notifikasi konsisten.
 */
class NotificationService
{
    public const TYPE_MAIN_QUEST = 'Main Quest';
    public const TYPE_QUIZ = 'Quiz';
    public const TYPE_PRACTICE = 'Practice';
    public const TYPE_DAILY_MISSION = 'Daily Mission';
    public const TYPE_CHALLENGE = 'Challenge';
    public const TYPE_FORUM = 'Forum';
    public const TYPE_SYSTEM = 'System';

    /**
     * Buat 1 notifikasi untuk 1 user. $reference (opsional) dipakai untuk
     * menyimpan reference_type/reference_id supaya notifikasi bisa dilacak
     * balik ke record asalnya.
     */
    public function send(User|int $user, string $type, string $title, string $message, ?Model $reference = null): Notification
    {
        return Notification::create([
            'user_id' => $user instanceof User ? $user->users_id : $user,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'reference_type' => $reference ? $reference::class : null,
            'reference_id' => $reference?->getKey(),
        ]);
    }

    /**
     * Sama seperti send(), tetapi dilewati kalau notifikasi yang persis sama
     * (user + tipe + judul + pesan + referensi) sudah pernah dibuat. Dipakai
     * untuk aksi yang bisa di-toggle berulang seperti like di forum.
     */
    public function sendOnce(User|int $user, string $type, string $title, string $message, ?Model $reference = null): ?Notification
    {
        $exists = Notification::where('user_id', $user instanceof User ? $user->users_id : $user)
            ->where('type', $type)
            ->where('title', $title)
            ->where('message', $message)
            ->where('reference_type', $reference ? $reference::class : null)
            ->where('reference_id', $reference?->getKey())
            ->exists();

        return $exists ? null : $this->send($user, $type, $title, $message, $reference);
    }

    /**
     * Kirim notifikasi ke pemilik komunitas + member aktif yang punya salah
     * satu role komunitas di $roleNames (mis. ['Ketua', 'Wakil Ketua', 'Staff']).
     * $exceptUserId dilewati (biasanya pelaku aksinya sendiri).
     *
     * @param  list<string>  $roleNames
     */
    public function sendToCommunityRoles(
        Community $community,
        array $roleNames,
        string $type,
        string $title,
        string $message,
        ?Model $reference = null,
        ?int $exceptUserId = null,
    ): void {
        $recipientIds = CommunityMember::where('community_id', $community->communities_id)
            ->where('status', 'Active')
            ->whereHas('role', fn ($query) => $query->whereIn('role_name', $roleNames))
            ->pluck('user_id')
            ->push($community->owner_id)
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->reject(fn (int $id) => $id === $exceptUserId);

        foreach ($recipientIds as $recipientId) {
            $this->send($recipientId, $type, $title, $message, $reference);
        }
    }

    /**
     * Kirim notifikasi ke pemilik komunitas + SEMUA member aktifnya, tanpa
     * filter role. Dipakai untuk pengumuman yang relevan buat semua orang,
     * seperti diskusi forum baru. $exceptUserId dilewati (biasanya pelakunya
     * sendiri).
     */
    public function sendToCommunityMembers(
        Community $community,
        string $type,
        string $title,
        string $message,
        ?Model $reference = null,
        ?int $exceptUserId = null,
    ): void {
        $recipientIds = CommunityMember::where('community_id', $community->communities_id)
            ->where('status', 'Active')
            ->pluck('user_id')
            ->push($community->owner_id)
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->reject(fn (int $id) => $id === $exceptUserId);

        foreach ($recipientIds as $recipientId) {
            $this->send($recipientId, $type, $title, $message, $reference);
        }
    }
}
