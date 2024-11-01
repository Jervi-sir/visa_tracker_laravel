<?php

namespace App\Http\Controllers;

use App\Models\UserNotification;
use App\Models\UserWebsite;
use App\Models\Website;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WebsiteController extends Controller
{
    public function index()
    {
        $websites = auth()->user()->websites()
            ->withPivot('website_name')
            ->with(['statusLogs' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->latest('user_websites.created_at')
            ->paginate(10);
        $websites = $websites->map(function ($website) {
            return [
                // 'name' => $website->name,
                'id' => $website->id,
                'pivot_id' => $website->pivot->id,
                // 'name' => $website->pivot->website_name, // From pivot table
                'name' => $website->name,
                'url' => $website->url,
                'is_online' => $website->is_online,
                'last_checked_at' => $website->last_checked_at,
                'latest_status_log' => optional($website->statusLogs->first())->status ?? null, // Latest status log
            ];
        });
        
        // Count Opened and Closed websites
        $openedCount = $websites->where('is_online', true)->count();
        $closedCount = $websites->where('is_online', false)->count();

        // Get IDs of user's tracked websites to exclude them
        $trackedWebsiteIds = $websites->pluck('id')->toArray();

        // Get all website for the dropdown
        $data['allWebsites'] = Website::where('confirmed', true)->whereNotIn('id', $trackedWebsiteIds)
            ->orderBy('name')
            ->get()
            ->map(function ($website) {
                return [
                    'id' => $website->id,
                    'name' => $website->name,
                    'url' => $website->url,
                    'is_online' => $website->is_online,
                    'last_checked_at' => $website->last_checked_at,
                    'latest_status_log' => optional($website->statusLogs->first())->status ?? null, // Latest status log
                ];
            });

        return Inertia::render('Dashboard/Dashboard', [
            'websites' => $websites,
            'openedCount' => $openedCount,
            'closedCount' => $closedCount,
            'allWebsites' => $data['allWebsites']
        ]);
    }

    public function suggest()
    {
        return Inertia::render('SuggestWebsites/SuggestWebsites');
    }

    public function storeSuggestion(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|min:2|max:255',
            'url' => 'required|url|max:255',
        ]);
        // Check if user has reached the limit of websites
        // if (auth()->user()->websites()->count() >= 5) {
        //     return back()->withErrors(['Maximum 5 websites allowed, Please Upgrade.']);
        // }

        try {
            // First check if website exists in the websites table
            $website = Website::where('url', $validated['url'])->first();
    
            if ($website) {
                return back()
                    ->withErrors(['This Website is Already registered.']);
            } else {
                // Website doesn't exist, create it and attach to user
                DB::transaction(function () use ($request, $validated) {
                    $website = Website::create([
                        'url' => $validated['url'],
                        'name' => $validated['name'],
                        'is_online' => false,
                    ]);
                });
            }
    
            return redirect()->route('websites.suggest')
                ->with('success', 'Website added successfully.');
                
        } catch (\Exception $e) {
            return back()->withErrors(['Failed to add website. Please try again.']);
        }
    }


    public function track(Request $request)
    {
        $validated = $request->validate([
            'websiteId' => 'required',
        ]);
        // Check if user has reached the limit of websites
        if (auth()->user()->websites()->count() >= 5) {
            return back()->withErrors(['Maximum 5 websites allowed, Please Upgrade.']);
        }

        try {
            // First check if website exists in the websites table
            $website = Website::find($request->websiteId);
    
            if ($website) {
                // Check if user already tracks this website
                $existingPivot = DB::table('user_websites')
                    ->where('user_id', auth()->id())
                    ->where('website_id', $website->id)
                    ->exists();
    
                if ($existingPivot) {
                    return back()
                        ->withErrors(['You are already tracking this website.']);
                }
    
                // Website exists but user doesn't track it yet
                auth()->user()->websites()->attach($website->id, [
                    'website_name' => $website->name
                ]);
            } else {
                // Website doesn't exist, create it and attach to user
                DB::transaction(function () use ($request, $validated, $website) {
                    $request->user()->websites()->attach($website->id, [
                        'website_name' => $website->name
                    ]);
                });
            }

    
            return redirect()->route('websites.list')
                ->with('success', 'Website added successfully.');
                
        } catch (\Exception $e) {
            dd($e);
            return back()->withErrors(['Failed to add website. Please try again.']);
        }
    

    }

    public function destroy(Request $request, $id)
    {
        $websiteId = $id;
        $authId = Auth::user()->id;

        $pivot = UserWebsite::where('user_id', $authId)->where('website_id', $websiteId)->first();
        $pivot->delete();
        return redirect()->route('websites.list');

        // auth()->user()->websites()->detach($website->id);
    }

    public function destroyOld(Request $request, $id)
    {
        try {
            DB::transaction(function () use ($request, $id) {
                $website = Website::findOrFail($id);
                $request->user()->websites()->detach($website->id);
                $website->delete();
            });

            return redirect()->route('websites.list')
                ->with('success', 'Website deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['Failed to delete website. Please try again.']);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'pivotId' => 'required',
            'name' => 'required|min:2|max:255',
            'url' => 'required|url|max:255|unique:websites,url,' . $id,
        ]);

        try {
            DB::transaction(function () use ($request, $validated, $id) {
                $website = Website::findOrFail($id);
                $website->update([
                    // 'name' => $validated['name'],
                    'url' => $validated['url'],
                ]);
                $pivot = UserWebsite::find($request->pivotId);
                $pivot->website_name = $request->name;
                $pivot->save();

            });
    
            return redirect()->route('websites.list')
                ->with('success', 'Website updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors( ['Failed to update website. Please try again.']);
        }
    
    }


    public function listNotifications(Request $request)
    {
        $auth = Auth::user();
        $auth->has_notifications = false;
        $auth->save();
        
        $paginatedNotifications = UserNotification::where('user_id', $auth->id)->orderByDesc('id')->paginate(10);
        
        // Transform the collection within the paginated data
        $paginatedNotifications->getCollection()->transform(function ($notification) {
            return [
                'content' => $notification->content,
                'created_at' => $notification->created_at,
            ];
        });

        // Pagination
        $pagination = [
            'total' => $paginatedNotifications->total(),
            'current_page' => $paginatedNotifications->currentPage(),
            'last_page' => $paginatedNotifications->lastPage(),
            'next_page' => $paginatedNotifications->currentPage() + 1 <= $paginatedNotifications->lastPage() ? $paginatedNotifications->currentPage() + 1 : null,
            'prev_page' => $paginatedNotifications->currentPage() - 1 >= 1 ? $paginatedNotifications->currentPage() - 1 : null,
        ];
        

        return Inertia::render('Notification/ListNotifications', [
            'notifications' => $paginatedNotifications->items(),
            'pagination' => $pagination,
        ]);
    }

}
