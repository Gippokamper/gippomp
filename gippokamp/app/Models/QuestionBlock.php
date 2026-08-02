<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuestionBlock extends Model
{
    use HasFactory;

    protected $fillable = [
        'blockable_id',
        'blockable_type',
        'slug',
        'sort',
        'name',
    ];

    protected $casts = [
        'name' => 'array'
    ];

    public function blockable()
    {
        return $this->morphTo();
    }

    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(Question::class, 'question_block_has_questions', 'block_id', 'question_id');
    }

    public function solved_questions($userId = null)
    {
        $query = $this->hasMany(UserTestAttempt::class, 'block_id');

        if ($userId) {
            $attempt = $query->where('user_id', $userId)->first();

            if (!$attempt) {
                return 0;
            }

            $right_answer = $attempt->right_answer;
            $wrong_answer = $attempt->wrong_answer;
            $help_answer = $attempt->help_answer;

            return $right_answer + $wrong_answer + $help_answer;
        }

        return 0;
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(UserTestAttempt::class, 'block_id');
    }
}
