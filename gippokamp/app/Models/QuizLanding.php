<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizLanding extends Model
{
    use HasFactory;
    protected $fillable = [
      'question',
      'answer',
    ];
    protected $casts = [
        'question' => 'array',
        'answer' => 'array',
    ];
}
