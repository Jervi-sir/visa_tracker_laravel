<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class TelegramHelper
{
    protected $botToken;
    protected $url;

    public function __construct()
    {
        $this->botToken = env('TELEGRAM_TOKEN');
        $this->url = "https://api.telegram.org/bot{$this->botToken}/sendMessage";
    }

    public function sendMessage(int $userId, string $message): bool
    {
        $user = User::find($userId);
        
        if (!$user || !$user->telegram_id) {
            Log::error("User not found or no Telegram ID.", ['user_id' => $userId]);
            return false;
        }

        $response = Http::post($this->url, [
            'chat_id' => $user->telegram_id,
            'text' => $message,
            'parse_mode' => 'Markdown', // Optional: allows for bold/italic formatting
        ]);

        // Check the response status
        if ($response->successful()) {
            return true; // Message sent successfully
        } else {
            // Log the error for debugging
            Log::error('Telegram sendMessage error', [
                'status' => $response->status(),
                'body' => $response->body(),
                'telegram_id' => $user->telegram_id,
            ]);
            return false; // Failed to send message
        }
    }
}
