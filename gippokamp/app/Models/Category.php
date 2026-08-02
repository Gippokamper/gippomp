<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'icon',
        'sort',
        'name',
        'paid'
    ];

    protected $casts = [
        'name' => 'array'
    ];

    public function parentCategory()
    {
        return $this->belongsToMany(Category::class, 'category_has_categories', 'child_category_id','parent_category_id')
            ->withPivot('sort')
            ->orderBy('sort');

    }

    public function childCategory()
    {
        return $this->belongsToMany(Category::class, 'category_has_categories', 'parent_category_id', 'child_category_id')
            ->withPivot('sort')
            ->orderBy('category_has_categories.sort');
    }

    public function articles()
    {
        return $this->belongsToMany(Article::class, 'category_has_articles', 'category_id', 'article_id')
            ->withPivot('sort')
            ->orderBy('category_has_articles.sort');
    }
}
