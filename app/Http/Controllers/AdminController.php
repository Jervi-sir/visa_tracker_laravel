<?php

namespace App\Http\Controllers;

use App\Jobs\SendUserNotifications;
use App\Models\User;
use App\Models\UserNotification;
use App\Models\Website;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function listWebsites(Request $request)
    {
        // Paginate the websites with 10 items per page
        $paginatedWebsites = Website::orderBy('confirmed')
            ->orderByDesc('id')
            ->paginate(10); 


        // Transform the collection within the paginated data
        $paginatedWebsites->getCollection()->transform(function ($website) {
            return [
                // 'name' => $website->name,
                'id' => $website->id,
                'name' => $website->name, 
                'url' => $website->url,
                'is_online' => $website->is_online,
                'confirmed' => $website->confirmed,
                'used_function' => $website->used_function,
                'last_checked_at' => $website->last_checked_at,
                'latest_status_log' => optional($website->statusLogs->first())->status ?? null, // Latest status log
            ];
        });

        // Count Opened and Closed websites
        $openedCount = $paginatedWebsites->filter(fn($website) => $website['confirmed'] && $website['is_online'])->count();
        $closedCount = $paginatedWebsites->filter(fn($website) => $website['confirmed'] && !$website['is_online'])->count();
            
        // Count Confirmed and Unconfirmed websites
        $confirmedCount = $paginatedWebsites->filter(fn($website) => $website['confirmed'])->count();
        $unconfirmedCount = $paginatedWebsites->filter(fn($website) => !$website['confirmed'])->count();

        // Pagination
        $pagination = [
            'total' => $paginatedWebsites->total(),
            'current_page' => $paginatedWebsites->currentPage(),
            'last_page' => $paginatedWebsites->lastPage(),
            'next_page' => $paginatedWebsites->currentPage() + 1 <= $paginatedWebsites->lastPage() ? $paginatedWebsites->currentPage() + 1 : null,
            'prev_page' => $paginatedWebsites->currentPage() - 1 >= 1 ? $paginatedWebsites->currentPage() - 1 : null,
        ];

        return Inertia::render('Admin/ListWebsites', [
            'websites' => $paginatedWebsites->items(),
            'pagination' => $pagination,
            'openedCount' => $openedCount,
            'closedCount' => $closedCount,
            'confirmedCount' => $confirmedCount,
            'unconfirmedCount' => $unconfirmedCount,
        ]);
    }

    public function showWebsite(Request $request)
    {
        
    }
    public function approveWebsite(Request $request)
    {
        try {
            $website = Website::find($request->id);
            $website->name = $request->name;
            $website->url = $request->url;
            $website->used_function = $request->used_function;
            $website->confirmed = $request->confirmed;
            $website->save();

            // $users = User::all();
            // foreach ($users as $index => $user) {
            //     $notification = new UserNotification();
            //     $notification->user_id = $user->id;
            //     $notification->content = $request->name . ' website has been recently added';
            //     $notification->save();

            //     $user->has_notifications = true;
            //     $user->save();
            // }
            // Dispatch the notification job to the queue
            SendUserNotifications::dispatch($request->name);

            return redirect()->route('admin.listWebsites')
                ->with('success', 'Website edited successfully.');
        } catch (\Exception $e) {
            dd($e);
            return back()->withErrors(['Failed to add website. Please try again.']);
        }
    }
    public function deleteWebsite(Request $request)
    {
        
    }


    public function suggestWebsite()
    {
        return Inertia::render('Admin/SuggestWebsites');
    }

    public function storeWebsiteSuggestion(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|min:2|max:255',
            'url' => 'required|url|max:255',
        ]);

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
    
            return redirect()->route('admin.listWebsites')
                ->with('success', 'Website added successfully.');
                
        } catch (\Exception $e) {
            return back()->withErrors(['Failed to add website. Please try again.']);
        }
    }
}
