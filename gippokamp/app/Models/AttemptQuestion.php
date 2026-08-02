<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AttemptQuestion extends Model
{
    use HasFactory;
    protected $fillable = [
        'sort',
        'attempt_id',
        'question_id',
        'user_answer_id',
        'status'
    ];
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
