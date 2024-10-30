<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function showSubscription(Request $request)
    {
        return Inertia::render("Subscription/ShowSubscription");
    }
}
