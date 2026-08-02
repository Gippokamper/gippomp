<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;
    protected $fillable = [
        'slug',
        'icon',
        'name',
        'paid'
    ];

    protected $casts = [
        'name' => 'json'
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_has_articles', 'article_id', 'category_id')
            ->withPivot('sort')
            ->orderBy('sort');
    }

    public function chapters()
    {
        return $this->belongsToMany(Chapter::class, 'article_has_chapters','article_id', 'chapter_id')
            ->withPivot('sort')
            ->orderBy('sort');
    }

    public function readByUsers()
    {
        return $this->belongsToMany(User::class, 'article_reads');
    }

    public function blocks()
    {
        return $this->morphMany(QuestionBlock::class, 'blockable');
    }
}
