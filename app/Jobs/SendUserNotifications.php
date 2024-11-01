<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendUserNotifications implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $websiteName;

    /**
     * Create a new job instance.
     */
    public function __construct($websiteName)
    {
        $this->websiteName = $websiteName;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $users = User::all();
        foreach ($users as $user) {
            $notification = new UserNotification();
            $notification->user_id = $user->id;
            $notification->content = $this->websiteName . ' website has been recently added';
            $notification->save();

            $user->has_notifications = true;
            $user->save();
        }
    }
}
