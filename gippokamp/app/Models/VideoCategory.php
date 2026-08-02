<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class VideoCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'sort',
        'name'
    ];

    protected $casts = [
        'name' => 'array'
    ];

    public function parentCategory()
    {
        return $this->belongsToMany(VideoCategory::class, 'video_category_has_video_categories', 'child_category_id','parent_category_id')
            ->withPivot('sort')
            ->orderBy('sort');
    }

    public function childCategory()
    {
        return $this->belongsToMany(VideoCategory::class, 'video_category_has_video_categories', 'parent_category_id', 'child_category_id')
            ->withPivot('sort')
            ->orderBy('sort');
    }

    public function videos()
    {
        return $this->belongsToMany(Video::class, 'video_category_has_videos', 'category_id', 'video_id')
            ->withPivot('sort')
            ->orderBy('sort');
    }

}
