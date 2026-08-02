<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FolderHasFolder extends Model
{
    use HasFactory;
    protected $fillable = [
        'parent_folder_id',
        'child_folder_id',
        'sort'
    ];
}
