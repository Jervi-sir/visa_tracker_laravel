<?php

use App\Http\Controllers\AuthenticateController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WebsiteController;
use App\Http\Middleware\TelegramAuthenticated;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
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
    Route::get('/websites-list', [WebsiteController::class, 'index'])->name('websites.list');
    Route::get('/websites-create', [WebsiteController::class, 'create'])->name('websites.createTracker');
    Route::post('/websites-store', [WebsiteController::class, 'store'])->name('websites.store');
    Route::post('/website-update/{id}', [WebsiteController::class, 'update'])->name('websites.update');
    Route::delete('/website-delete/{id}', [WebsiteController::class, 'destroy'])->name('websites.destroy');
});


/*
|--------------------------------------------------------------------------
| Authentication page
|--------------------------------------------------------------------------
*/
Route::get('/auth/telegram', [AuthenticateController::class, 'callback'])->name('telegram.callback');
Route::get('/auth-page', [AuthenticateController::class, 'login'])->name('telegram.login');


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

require __DIR__.'/auth.php';
