<?php

namespace App\Http\Controllers;

use App\Events\BroadcastSiteStatusToUser;
use App\Models\Website;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class BroadcastController extends Controller
{
    public function broadcastWebsiteToUsers() 
    {
        $website = Website::first();
        $response = Http::get($website->url);
        $isOnline = $response->successful();
        if ($website->is_online !== $isOnline) {
            // Log the status change
            $website->statusLogs()->create([
                'status' => $isOnline,
                'checked_at' => now(),
            ]);

            // Update website status
            $website->update([
                'is_online' => $isOnline,
                'last_checked_at' => now(),
            ]);
            $websiteSubscribers = $website->users()->get();
            $user = $websiteSubscribers->first();
            broadcast(new BroadcastSiteStatusToUser( $website, $user));
        }
    }
}
