<?php

use App\Models\Community;
use App\Models\CommunityMember;
use App\Models\CommunityRole;
use App\Models\MusicCategory;
use App\Models\Notification;
use App\Models\User;
use App\Services\NotificationService;

function makeCommunity(User $owner): Community
{
    $category = MusicCategory::firstOrCreate(['name' => 'String']);

    return Community::factory()->create([
        'owner_id' => $owner->users_id,
        'category_id' => $category->music_categories_id,
    ]);
}

test('send stores a notification with its reference', function () {
    $user = User::factory()->create();
    $community = makeCommunity(User::factory()->create());

    $notification = app(NotificationService::class)->send(
        $user, 'System', 'Halo', 'Pesan uji', $community,
    );

    expect($notification->user_id)->toBe($user->users_id)
        ->and($notification->reference_type)->toBe(Community::class)
        ->and($notification->reference_id)->toBe($community->communities_id)
        ->and($notification->is_read)->toBeFalse();
});

test('sendOnce does not duplicate an identical notification', function () {
    $user = User::factory()->create();
    $service = app(NotificationService::class);

    $service->sendOnce($user, 'Forum', 'Post kamu disukai', 'Budi menyukai post "X".');
    $service->sendOnce($user, 'Forum', 'Post kamu disukai', 'Budi menyukai post "X".');

    expect(Notification::where('user_id', $user->users_id)->count())->toBe(1);
});

test('sendToCommunityRoles reaches owner and matching roles but skips the actor', function () {
    $owner = User::factory()->create();
    $vice = User::factory()->create();
    $member = User::factory()->create();
    $community = makeCommunity($owner);

    $viceRole = CommunityRole::firstOrCreate(['role_name' => 'Wakil Ketua'], ['description' => 'Wakil']);
    $memberRole = CommunityRole::firstOrCreate(['role_name' => 'Member'], ['description' => 'Member']);

    CommunityMember::create(['community_id' => $community->communities_id, 'user_id' => $vice->users_id, 'role_id' => $viceRole->community_roles_id, 'join_date' => now(), 'status' => 'Active']);
    CommunityMember::create(['community_id' => $community->communities_id, 'user_id' => $member->users_id, 'role_id' => $memberRole->community_roles_id, 'join_date' => now(), 'status' => 'Active']);

    app(NotificationService::class)->sendToCommunityRoles(
        $community, ['Ketua', 'Wakil Ketua'], 'System', 'Ada permintaan', 'Pesan', null, $vice->users_id,
    );

    expect(Notification::where('user_id', $owner->users_id)->count())->toBe(1)
        ->and(Notification::where('user_id', $vice->users_id)->count())->toBe(0)
        ->and(Notification::where('user_id', $member->users_id)->count())->toBe(0);
});

test('notification api returns unread_count', function () {
    $user = User::factory()->create();
    $service = app(NotificationService::class);
    $service->send($user, 'System', 'A', 'a');
    $service->send($user, 'System', 'B', 'b')->update(['is_read' => true]);

    $this->actingAs($user)
        ->getJson('/api/notifications')
        ->assertOk()
        ->assertJsonPath('unread_count', 1)
        ->assertJsonCount(2, 'data');
});

test('sendToCommunityMembers reaches owner and every active member but skips the actor', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $actor = User::factory()->create();
    $inactive = User::factory()->create();
    $community = makeCommunity($owner);

    $memberRole = CommunityRole::firstOrCreate(['role_name' => 'Member'], ['description' => 'Member']);

    CommunityMember::create(['community_id' => $community->communities_id, 'user_id' => $member->users_id, 'role_id' => $memberRole->community_roles_id, 'join_date' => now(), 'status' => 'Active']);
    CommunityMember::create(['community_id' => $community->communities_id, 'user_id' => $actor->users_id, 'role_id' => $memberRole->community_roles_id, 'join_date' => now(), 'status' => 'Active']);
    CommunityMember::create(['community_id' => $community->communities_id, 'user_id' => $inactive->users_id, 'role_id' => $memberRole->community_roles_id, 'join_date' => now(), 'status' => 'Banned']);

    app(NotificationService::class)->sendToCommunityMembers(
        $community, 'Forum', 'Diskusi forum baru', 'Pesan', null, $actor->users_id,
    );

    expect(Notification::where('user_id', $owner->users_id)->count())->toBe(1)
        ->and(Notification::where('user_id', $member->users_id)->count())->toBe(1)
        ->and(Notification::where('user_id', $actor->users_id)->count())->toBe(0)
        ->and(Notification::where('user_id', $inactive->users_id)->count())->toBe(0);
});

test('creating a forum post notifies community members except the author', function () {
    $owner = User::factory()->create();
    $author = User::factory()->create();
    $community = makeCommunity($owner);

    $memberRole = CommunityRole::firstOrCreate(['role_name' => 'Member'], ['description' => 'Member']);
    CommunityMember::create(['community_id' => $community->communities_id, 'user_id' => $author->users_id, 'role_id' => $memberRole->community_roles_id, 'join_date' => now(), 'status' => 'Active']);

    $this->actingAs($author)
        ->postJson("/api/communities/{$community->communities_id}/forum-posts", [
            'title' => 'awikwok',
            'content' => 'safsafsa',
        ])
        ->assertStatus(201);

    expect(Notification::where('user_id', $owner->users_id)->where('type', 'Forum')->count())->toBe(1)
        ->and(Notification::where('user_id', $author->users_id)->where('type', 'Forum')->count())->toBe(0);
});
