<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserTestAttempt extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'block_id',
        'time',
        'right_answer',
        'wrong_answer',
        'help_answer',
        'no_answer'
    ];
    public function attempt_question(): HasMany
    {
        return $this->hasMany(AttemptQuestion::class,'attempt_id');
    }

    public function block(): BelongsTo
    {
        return $this->belongsTo(QuestionBlock::class, 'block_id');
    }
}
