<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class BroadcastSiteStatusToUser implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $website;
    public $user;

    public function __construct($website, $websiteSubscribers)
    {
        $this->website = $website;
        $this->user = $websiteSubscribers;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new PresenceChannel('broadcast-sites-statuses.' . $this->user->id);
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->website->id,
            'name' => $this->website->name,
            'url' => $this->website->url,
            'is_online' => $this->website->is_online,
            'last_checked_at' => $this->website->last_checked_at,
        ];
    }

}
