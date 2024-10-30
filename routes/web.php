<?php

use App\Events\BroadcastSiteStatusToUser;
use App\Helpers\ScraperHelper;
use App\Helpers\TelegramHelper;
use App\Http\Controllers\AuthenticateController;
use App\Http\Controllers\BroadcastController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\WebsiteController;
use App\Http\Middleware\TelegramAuthenticated;
use App\Models\User;
use App\Models\Website;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
// Route::middleware([TelegramAuthenticated::class])->group(function () {
Route::middleware(['auth'])->group(function () {
    /*
    |--------------------------------------------------------------------------
    | User Routing 
    */
    Route::get('/websites-list', [WebsiteController::class, 'index'])->name('websites.list');
    Route::post('/websites-add-tracker', [WebsiteController::class, 'track'])->name('websites.track');
    Route::delete('/website-delete/{id}', [WebsiteController::class, 'destroy'])->name('websites.destroy');
    // Route::post('/website-update/{id}', [WebsiteController::class, 'update'])->name('websites.update');

    /*
    |--------------------------------------------------------------------------
    | User Suggest to us
    */
    Route::get('/websites-suggest', [WebsiteController::class, 'suggest'])->name('websites.suggest');
    Route::post('/websites-store-suggestion', [WebsiteController::class, 'storeSuggestion'])->name('websites.storeSuggestion');
});

/*
|--------------------------------------------------------------------------
| Subscription
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::get('/my-subscription', [SubscriptionController::class, 'showSubscription'])->name('subscription.list');
    Route::delete('/website-delete/{id}', [WebsiteController::class, 'destroy'])->name('websites.destroy');
});

/*
|--------------------------------------------------------------------------
| Authentication page
|--------------------------------------------------------------------------
*/
Route::get('/auth/telegram', [AuthenticateController::class, 'callback'])->name('telegram.callback');
Route::get('/login-with-telegram', [AuthenticateController::class, 'login'])->name('telegram.login');
Route::get('test-broadcast', [BroadcastController::class, 'broadcastWebsiteToUsers']);

/*
|--------------------------------------------------------------------------
| Old
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return redirect()->route('websites.list');
    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);
});

Route::get('/send-telegram', function() {
    $telegramBot = new TelegramHelper();
    $telegramBot->sendMessage(1, 'bruh what u mean');
});


Route::get('test-bls', function() {
    $scraper = new ScraperHelper();
    $scraperStatus = $scraper->isBLSOpen();
    dd($scraperStatus);
});

require __DIR__.'/auth.php';
