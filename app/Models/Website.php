<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Website extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'url', 'is_online', 'last_checked_at', 'need_scrape'];

    protected $casts = [
        'is_online' => 'boolean',
        'last_checked_at' => 'datetime',
    ];

    public function users()  
    {
        return $this->belongsToMany(User::class, 'user_websites')
                    ->withPivot(['id', 'website_name'])
                    ->withTimestamps();
    }

    public function statusLogs()
    {
        return $this->hasMany(WebsiteStatusLog::class);
    }

}
