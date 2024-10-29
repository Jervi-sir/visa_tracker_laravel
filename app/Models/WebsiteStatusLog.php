<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebsiteStatusLog extends Model
{
    use HasFactory;

    protected $fillable = ['website_id', 'status', 'checked_at'];

    protected $casts = [
        'status' => 'boolean',
        'checked_at' => 'datetime',
    ];


    public function website()
    {
        return $this->belongsTo(Website::class);
    }

}
