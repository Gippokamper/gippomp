<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
    ];
    protected $casts = [
        'title' => 'array',
        'description' => 'array',
    ];

    public function articles()
    {
        return $this->belongsToMany(Article::class, 'article_has_chapters', 'chapter_id', 'article_id')
            ->withPivot('sort')
            ->orderBy('sort');
    }
}
