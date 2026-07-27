<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'username' => ['required', 'string', 'max:50', 'unique:users,username'],
            'password' => $this->passwordRules(),
        ])->validate();
    
        $defaultRole  = \App\Models\Role::where('role_name', 'Member')->first();
        $defaultLevel = \App\Models\Level::orderBy('min_xp')->first();
    
        return User::create([
            'role_id'    => $defaultRole?->role_id,
            'level_id'   => $defaultLevel?->level_id,
            'username'   => $input['username'],
            'name'       => $input['name'],
            'email'      => $input['email'],
            'password'   => $input['password'],
            'total_xp'   => 0,
            'total_point'=> 0,
            'status'     => 'Active',
        ]);
    }
}
