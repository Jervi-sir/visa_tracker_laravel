<?php

namespace App\Console\Commands;

use App\Events\BroadcastSiteStatusToUser;
use Illuminate\Console\Command;

use App\Models\Website;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use App\Notifications\WebsiteStatusChanged;


class CheckWebsitesStatus extends Command
{
    protected $signature = 'websites:check-status';
    protected $description = 'Check status of all tracked websites';

    public function handle()
    {
        $websites = Website::has('users')->get();

        foreach ($websites as $website) {
            try {
                $response = Http::get($website->url);
                $isOnline = $response->successful();

                // If status changed
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

                    // Notify all users tracking this website
                    foreach ($website->users as $user) {
                        if ($user->telegram_id) {
                            Notification::send($user, new WebsiteStatusChanged());
                        }
                        broadcast(new BroadcastSiteStatusToUser( $website, $user));
                    }
                    // Broadcast the website status change
                }
            } catch (\Exception $e) {
                $this->error("Error checking {$website->url}: {$e->getMessage()}");
            }
        }
    }

}
