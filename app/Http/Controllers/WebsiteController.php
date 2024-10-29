<?php

namespace App\Http\Controllers;

use App\Models\Website;
use Illuminate\Http\Request;

class WebsiteController extends Controller
{
    public function index()
    {
        $websites = auth()->user()->websites()->get();
        return view('websites.index', compact('websites'));
    }

    public function create()
    {
        return view('websites.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|max:255',
            'url' => 'required|url|max:255',
        ]);

        // Check if user has reached limit
        if (auth()->user()->websites()->count() >= 5) {
            return redirect()->back()->with('error', 'Maximum 5 websites allowed');
        }

        // Find or create website
        $website = Website::firstOrCreate(
            ['name' => $request->name],
            ['url' => $request->url]
        );

        // Attach to user if not already attached
        auth()->user()->websites()->syncWithoutDetaching([$website->id]);

        return redirect()->route('websites.index');
    }

    public function destroy(Website $website)
    {
        auth()->user()->websites()->detach($website->id);
        return redirect()->route('websites.index');
    }

}
