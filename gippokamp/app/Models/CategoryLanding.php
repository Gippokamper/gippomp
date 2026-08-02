<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryLanding extends Model
{
    use HasFactory;
    protected $fillable = [
        'category_id',
        'name',
        'photo'
    ];
    protected $casts = [
        'name' => 'array'
    ];

    public function parentCategory()
    {
        return $this->belongsTo(CategoryLanding::class, 'category_id');
    }

    public function childCategory()
    {
        return $this->hasMany(CategoryLanding::class, 'category_id');
    }
}
