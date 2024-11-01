<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MultiAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if we're in production environment
        if (env('ENABLE_TELEGRAM_AUTH')) {
            // Use Telegram authentication
            if (!auth()->guard('telegram')->check()) {
                return redirect()->route('telegram.login');
            }
        } else {
            // Use regular web authentication for local/development
            if (!auth()->guard('web')->check()) {
                return redirect()->route('login');
            }
        }

        return $next($request);

    }
}
