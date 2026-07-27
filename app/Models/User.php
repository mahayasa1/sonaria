<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'users_id';

    protected $fillable = [
        'role_id',
        'level_id',
        'instrument_id',
        'username',
        'name',
        'email',
        'password',
        'photo',
        'bio',
        'total_xp',
        'total_point',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'two_factor_confirmed_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relasi dasar

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class, 'level_id', 'level_id');
    }

    public function instrument(): BelongsTo
    {
        return $this->belongsTo(Instrument::class, 'instrument_id', 'intruments_id');
    }

    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class, 'user_id', 'users_id');
    }

    public function passkeys(): HasMany
    {
        return $this->hasMany(Passkey::class, 'user_id', 'users_id');
    }

    // Gamifikasi

    public function badges(): HasMany
    {
        return $this->hasMany(UserBadge::class, 'user_id', 'users_id');
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(UserAchievement::class, 'user_id', 'users_id');
    }

    public function levelHistories(): HasMany
    {
        return $this->hasMany(UserLevelHistory::class, 'user_id', 'users_id');
    }

    public function xpLogs(): HasMany
    {
        return $this->hasMany(XpLog::class, 'user_id', 'users_id');
    }

    public function pointLogs(): HasMany
    {
        return $this->hasMany(PointLog::class, 'user_id', 'users_id');
    }

    public function categoryPoints(): HasMany
    {
        return $this->hasMany(UserCategoryPoint::class, 'user_id', 'users_id');
    }

    // Komunitas

    public function ownedCommunities(): HasMany
    {
        return $this->hasMany(Community::class, 'owner_id', 'users_id');
    }

    public function communityMemberships(): HasMany
    {
        return $this->hasMany(CommunityMember::class, 'user_id', 'users_id');
    }

    public function communityJoinRequests(): HasMany
    {
        return $this->hasMany(CommunityJoinRequest::class, 'user_id', 'users_id');
    }

    // Pembelajaran

    public function materialProgress(): HasMany
    {
        return $this->hasMany(MaterialProgress::class, 'user_id', 'users_id');
    }

    public function practiceSubmissions(): HasMany
    {
        return $this->hasMany(PracticeSubmission::class, 'user_id', 'users_id');
    }

    public function quizAttempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class, 'user_id', 'users_id');
    }

    public function dailyMissions(): HasMany
    {
        return $this->hasMany(UserDailyMission::class, 'user_id', 'users_id');
    }

    public function challengeSubmissions(): HasMany
    {
        return $this->hasMany(ChallengeSubmission::class, 'user_id', 'users_id');
    }

    // Sosial

    public function forumPosts(): HasMany
    {
        return $this->hasMany(ForumPost::class, 'user_id', 'users_id');
    }

    public function forumComments(): HasMany
    {
        return $this->hasMany(ForumComment::class, 'user_id', 'users_id');
    }

    public function forumLikes(): HasMany
    {
        return $this->hasMany(ForumLike::class, 'user_id', 'users_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id', 'users_id');
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class, 'user_id', 'users_id');
    }

    public function uploadedMediaFiles(): HasMany
    {
        return $this->hasMany(MediaFile::class, 'uploaded_by', 'users_id');
    }
}
