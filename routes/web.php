<?php

use App\Console\Commands\CheckWebsitesStatus;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthenticateController;
use App\Http\Controllers\ChargilyPayController;
use App\Http\Controllers\CheckWebsitesStatusController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\WebsiteController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\MultiAuthMiddleware;
use Illuminate\Support\Facades\Route;
use Laravel\Reverb\Protocols\Pusher\Http\Controllers\HealthCheckController;

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
Route::get('/', function () { return redirect()->route('websites.list'); });
Route::middleware([MultiAuthMiddleware::class])->group(function () {
    /*
    | User Routing 
    */
    Route::get('/websites-list', [WebsiteController::class, 'index'])->name('websites.list');
    Route::post('/websites-add-tracker', [WebsiteController::class, 'track'])->name('websites.track');
    Route::delete('/website-delete/{id}', [WebsiteController::class, 'destroy'])->name('websites.destroy');

    Route::get('/notification-list', [WebsiteController::class, 'listNotifications'])->name('websites.notifications');

    /*
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
Route::middleware([MultiAuthMiddleware::class])->group(function () {
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

/*
|--------------------------------------------------------------------------
| Payment Controller
|--------------------------------------------------------------------------
*/
Route::middleware([MultiAuthMiddleware::class])->group(function () {
    Route::get('chargilypay/redirect', [ChargilyPayController::class, "redirect"])->name("chargilypay.redirect");
    Route::get('chargilypay/back', [ChargilyPayController::class, "back"])->name("chargilypay.back");
    Route::post('chargilypay/webhook', [ChargilyPayController::class, "webhook"])->name("chargilypay.webhook_endpoint");
});

/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware([MultiAuthMiddleware::class, AdminMiddleware::class])->group(function () {
    Route::get('/list-websites', [AdminController::class, "listWebsites"])->name("admin.listWebsites");
    Route::get('/show-website', [AdminController::class, "showWebsite"])->name("admin.showWebsite");
    Route::post('/website-update/{id}', [AdminController::class, 'approveWebsite'])->name('websites.approveWebsite');

    Route::get('/websites-suggest', [AdminController::class, 'suggestWebsite'])->name('admin.suggestWebsite');
    Route::post('/websites-store-suggestion', [AdminController::class, 'storeWebsiteSuggestion'])->name('admin.storeWebsiteSuggestion');
    
    // Route::delete('/delete-website', [AdminController::class, "deleteWebsite"])->name("admin.deleteWebsite");
});


/*
|--------------------------------------------------------------------------
| Testing
|--------------------------------------------------------------------------
*/

Route::get('test-check-websites-statuses', [CheckWebsitesStatusController::class, 'CheckStatutes']);

// Route::get('test-broadcast', [BroadcastController::class, 'broadcastWebsiteToUsers']);

// Route::get('/send-telegram', function() {
//     $telegramBot = new TelegramHelper();
//     $telegramBot->sendMessage(1, 'bruh what u mean');
// });

// Route::get('test-bls', function() {
//     $scraper = new ScraperHelper();
//     $scraperStatus = $scraper->isBLSOpen();
//     dd($scraperStatus);
// });

require __DIR__.'/auth.php';
