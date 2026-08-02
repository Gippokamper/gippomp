<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    use HasFactory;
    protected $fillable = [
        'slug',
        'name',
    ];
    protected $casts = [
        'name' => 'array'
    ];
    public function parentFolder()
    {
        return $this->belongsToMany(Folder::class, 'folder_has_folders', 'child_folder_id','parent_folder_id')
            ->withPivot('sort')
            ->orderBy('sort');
    }

    public function childFolder()
    {
        return $this->belongsToMany(Folder::class, 'folder_has_folders', 'parent_folder_id', 'child_folder_id')
            ->withPivot('sort')
            ->orderBy('sort');
    }

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'folder_has_questions', 'folder_id', 'question_id');
    }
}
