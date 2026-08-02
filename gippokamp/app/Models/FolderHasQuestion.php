<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FolderHasQuestion extends Model
{
    use HasFactory;
    protected $fillable = [
        'folder_id',
        'question_id'
    ];
}
