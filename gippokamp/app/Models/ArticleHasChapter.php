<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleHasChapter extends Model
{
    use HasFactory;
    protected $fillable = [
        'article_id',
        'chapter_id',
        'sort'
    ];
}
