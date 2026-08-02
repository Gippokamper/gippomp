<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'sort',
        'slug',
        'name',
        'info',
    ];

    protected $casts = [
        'name' => 'array',
        'info' => 'array',
    ];

    public function parentQuiz()
    {
        return $this->belongsToMany(Quiz::class, 'quiz_has_quizzes', 'child_quiz_id','parent_quiz_id')
            ->withPivot('sort')
            ->orderBy('sort');

    }

    public function childQuiz()
    {
        return $this->belongsToMany(Quiz::class, 'quiz_has_quizzes', 'parent_quiz_id', 'child_quiz_id')
            ->withPivot('sort')
            ->orderBy('sort');
    }

    public function blocks()
    {
        return $this->morphMany(QuestionBlock::class, 'blockable');
    }
}
