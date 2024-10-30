<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

class AuthenticateController extends Controller
{
    public function login() 
    {
        return Inertia::render('AuthTelegram');
        // return Socialite::driver('telegram')->redirect();
    }
    public function callback(Request $request)
    {
        try {
            $telegramData = $request->all();
            
            // Store user data in session
            session()->put('telegram_auth', $telegramData);
            
            // Create or update user
            $user = User::updateOrCreate(
                ['telegram_id' => $telegramData['id']],
                [
                    'name' => $telegramData['first_name'] . ' ' . ($telegramData['last_name'] ?? ''),
                    'username' => $telegramData['username'] ?? null,
                    'first_name' => $telegramData['first_name'],
                    'last_name' => $telegramData['last_name'] ?? null,
                    'photo_url' => $telegramData['photo_url'] ?? null,
                    'auth_date' => date('Y-m-d H:i:s', $telegramData['auth_date']),
                    'hash' => $telegramData['hash'] ?? null,
                ]
            );
                        
            Auth::login($user);
            
            return redirect()->route('websites.list')
                ->with('success', 'Successfully logged in with Telegram!');
                
        } catch (\Exception $e) {
            logger()->error('Telegram auth error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('telegram.login')
                ->with('error', 'Authentication failed. Please try again.');
        }
    }

    
    public function logout(Request $request)
    {
        Auth::logout();
        session()->forget('telegram_auth');
        
        return redirect()->route('telegram.login')
            ->with('success', 'Successfully logged out!');
    }
}
