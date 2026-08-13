<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\Badge;
use App\Models\Community;
use App\Models\Instrument;
use App\Models\MusicCategory;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Panel Admin. Belum ada Api\Admin* controller khusus (lihat CLAUDE.md menu
 * Admin: Users, Music Categories, Communities, Materials, Quizzes, dst) —
 * untuk langkah ini baru Users & Communities yang disambungkan penuh,
 * termasuk aksi moderasi dasar (aktif/blokir). Sisanya (Materials, Quizzes,
 * Challenges, Achievements, Badges, Reports) menyusul mengikuti pola yang
 * sama begitu dibutuhkan.
 */
class AdminWebController extends Controller
{
    public function users(Request $request): Response
    {
        $this->ensureAdmin($request);

        $query = User::query()->with(['role', 'level']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $term = '%'.$request->string('search').'%';
                $q->where('name', 'like', $term)->orWhere('email', 'like', $term);
            });
        }

        return Inertia::render('Admin/Users', [
            'users' => $query->orderByDesc('created_at')->paginate(15)->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }

    public function toggleUserStatus(Request $request, User $user): RedirectResponse
    {
        $this->ensureAdmin($request);

        if ($user->users_id === $request->user()->users_id) {
            return redirect()->route('admin.users')
                ->with('error', 'Tidak bisa mengubah status akun sendiri.');
        }

        $user->update(['status' => $user->status === 'Active' ? 'Blocked' : 'Active']);

        // Pakai redirect eksplisit ke route, bukan back(), supaya tidak
        // bergantung pada header Referer (yang kadang tidak terkirim,
        // menyebabkan toggle "kelihatan" tidak ngapa-ngapain / stuck di sisi
        // klien meski data di database sebenarnya sudah berubah).
        return redirect()->route('admin.users', $request->only('search'))
            ->with('success', "Status {$user->name} diperbarui menjadi {$user->status}.");
    }

    public function communities(Request $request): Response
    {
        $this->ensureAdmin($request);

        $query = Community::query()->with(['category', 'owner']);

        if ($request->filled('search')) {
            $query->where('community_name', 'like', '%'.$request->string('search').'%');
        }

        return Inertia::render('Admin/Communities', [
            'communities' => $query->orderByDesc('total_member')->paginate(15)->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }

    public function toggleCommunityStatus(Request $request, Community $community): RedirectResponse
    {
        $this->ensureAdmin($request);

        $community->update(['status' => $community->status === 'Active' ? 'Inactive' : 'Active']);

        return redirect()->route('admin.communities', $request->only('search'))
            ->with('success', "Status {$community->community_name} diperbarui.");
    }

    public function categories(Request $request): Response
    {
        $this->ensureAdmin($request);

        return Inertia::render('Admin/Categories', [
            'categories' => MusicCategory::withCount('instruments', 'communities')
                ->with('instruments')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:music_categories,name'],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:100'],
        ]);

        MusicCategory::create($data);

        return back()->with('success', 'Kategori baru ditambahkan.');
    }

    public function destroyCategory(Request $request, MusicCategory $category): RedirectResponse
    {
        $this->ensureAdmin($request);

        if ($category->instruments()->exists() || $category->communities()->exists()) {
            return back()->with('error', 'Kategori masih dipakai instrument/komunitas, tidak bisa dihapus.');
        }

        $category->delete();

        return back()->with('success', 'Kategori dihapus.');
    }

    public function storeInstrument(Request $request, MusicCategory $category): RedirectResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:255'],
            'difficulty' => ['nullable', 'in:Easy,Medium,Hard'],
        ]);

        $category->instruments()->create($data);

        return back()->with('success', 'Instrument baru ditambahkan.');
    }

    public function destroyInstrument(Request $request, Instrument $instrument): RedirectResponse
    {
        $this->ensureAdmin($request);

        if ($instrument->users()->exists() || $instrument->materials()->exists() || $instrument->challenges()->exists()) {
            return back()->with('error', 'Instrument masih dipakai, tidak bisa dihapus.');
        }

        $instrument->delete();

        return back()->with('success', 'Instrument dihapus.');
    }

    public function achievements(Request $request): Response
    {
        $this->ensureAdmin($request);

        return Inertia::render('Admin/Achievements', [
            'achievements' => Achievement::withCount('userAchievements')->orderByDesc('achievements_id')->get(),
        ]);
    }

    public function storeAchievement(Request $request): RedirectResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:100'],
            'xp_reward' => ['required', 'integer', 'min:0'],
            'point_reward' => ['nullable', 'integer', 'min:0'],
        ]);

        Achievement::create($data);

        return back()->with('success', 'Achievement baru ditambahkan.');
    }

    public function destroyAchievement(Request $request, Achievement $achievement): RedirectResponse
    {
        $this->ensureAdmin($request);
        $achievement->delete();

        return back()->with('success', 'Achievement dihapus.');
    }

    public function badges(Request $request): Response
    {
        $this->ensureAdmin($request);

        return Inertia::render('Admin/Badges', [
            'badges' => Badge::withCount('userBadges')->orderByDesc('badges_id')->get(),
        ]);
    }

    public function storeBadge(Request $request): RedirectResponse
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'badge_name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:100'],
            'xp_required' => ['nullable', 'integer', 'min:0'],
            'point_required' => ['nullable', 'integer', 'min:0'],
        ]);

        Badge::create($data);

        return back()->with('success', 'Badge baru ditambahkan.');
    }

    public function destroyBadge(Request $request, Badge $badge): RedirectResponse
    {
        $this->ensureAdmin($request);
        $badge->delete();

        return back()->with('success', 'Badge dihapus.');
    }

    public function settings(Request $request): Response
    {
        $this->ensureAdmin($request);

        return Inertia::render('Admin/Settings', [
            'appName' => config('app.name'),
        ]);
    }

    protected function ensureAdmin(Request $request): void
    {
        if ($request->user()->role?->role_name !== 'Admin') {
            abort(403, 'Khusus Admin.');
        }
    }
}
