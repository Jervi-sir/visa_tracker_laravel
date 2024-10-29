<?php

namespace App\Policies;

use App\Models\User;

class WebsitePolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function create(User $user)
    {
        return $user->websites()->count() < 5;
    }
}
