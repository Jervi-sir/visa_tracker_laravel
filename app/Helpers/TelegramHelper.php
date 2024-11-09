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

    public function sendMessage(int $telegram_id, string $message): bool
    {
        if (!$telegram_id) {
            Log::error("User not found or no Telegram ID.", ['user_id' => User::where('telegram_id', $telegram_id)->first()]);
            return false;
        }

        $response = Http::post($this->url, [
            'chat_id' => $telegram_id,
            'text' => $message,
            'parse_mode' => 'Markdown',
        ]);

        // Check the response status
        if ($response->successful()) {
            return true; // Message sent successfully
        } else {
            // Log the error for debugging
            Log::error('Telegram sendMessage error', [
                'status' => $response->status(),
                'body' => $response->body(),
                'telegram_id' => $telegram_id,
            ]);
            return false; // Failed to send message
        }
    }
}
