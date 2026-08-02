<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;
    protected $fillable = [
        'slug',
        'photo',
        'title',
        'description',
        'date',
        'actual',
    ];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
    ];

    public function savedByUsers()
    {
        return $this->belongsToMany(User::class, 'news_saves');
    }
}
