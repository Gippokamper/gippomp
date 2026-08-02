<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'article_id',
        'block_id',
        'question_id',
        'chapter_id',
        'type'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function block()
    {
        return $this->belongsTo(QuestionBlock::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function messages()
    {
        return $this->hasMany(FeedbackMessage::class);
    }
}
