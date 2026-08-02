<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryHasArticle extends Model
{
    use HasFactory;
    protected $fillable = [
        'category_id',
        'article_id',
        'sort'
    ];
}
