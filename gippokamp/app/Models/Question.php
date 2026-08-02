<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'photo',
        'name',
        'additional_info'
    ];

    protected $casts = [
        'photo' => 'array',
        'name' => 'array',
        'additional_info' => 'array',
    ];

    public function folders(): BelongsToMany
    {
        return $this->belongsToMany(Folder::class, 'folder_has_questions','question_id', 'folder_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }
    public function randomAnswers(): HasMany
    {
        return $this->hasMany(Answer::class)->inRandomOrder();
    }
}
