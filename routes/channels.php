<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('broadcast-sites-statuses.{userId}', function($user, $userId) {
    return [
        'id' => $user->id, 
        'name' => $user->name,
    ];
});
