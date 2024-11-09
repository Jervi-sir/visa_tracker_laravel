<?php

namespace App\Http\Controllers;

use App\Helpers\ScraperHelper;
use App\Helpers\TelegramHelper;
use Illuminate\Http\Request;
use App\Events\BroadcastSiteStatusToUser;
use App\Models\Website;
use App\Notifications\WebsiteStatusChanged;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;

class CheckWebsitesStatusController extends Controller
{
    public function CheckStatutes(Request $request)
    {
        $websites = Website::has('users')->get();
        foreach ($websites as $index => $website) {
            try {
                // check if is online
                try {
                    $response = Http::timeout(5)->get($website->url);
                    $isOnline = $response->successful();
                } catch (\Exception $e) {
                    $isOnline = false;
                }
                
                // if is online
                if(!$isOnline) continue; 

                // check if website require web scrape
                if($website->need_scrape) {
                    $scraper = new ScraperHelper();
                    // check if with web scrape is online
                    $isOnline = $scraper->isBLSOpen();
                }

                // check if current status is same as previous status
                if($website->is_online === $isOnline) continue;
                // if no then send notifications
                
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
                        $telegramBot = new TelegramHelper();
                        $telegramBot->sendMessage($user->telegram_id, $website->name . ' is available Now, via link ' . $website->url);
                    }
                    // Broadcast the website status change
                    broadcast(new BroadcastSiteStatusToUser( $website, $user));
                }

            } catch (\Exception $e) {
                dd($e);
                // $this->error("Error checking {$website->url}: {$e->getMessage()}");
            }
        }
    }
}
