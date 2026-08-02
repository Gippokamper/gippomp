<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleNotePhoto extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'photo',
        'marker_photo',
    ];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
    ];
}
