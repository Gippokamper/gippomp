<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;
    protected $fillable = [
        'slug',
        'name',
        'link'
    ];
    protected $casts = [
        'name' => 'array'
    ];

    public function categories()
    {
        return $this->belongsToMany(VideoCategory::class, 'video_category_has_videos', 'video_id', 'category_id')
        ->withPivot('sort')
        ->orderBy('sort');
    }
}
