<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudyPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'sort',
        'name',
        'info'
    ];

    protected $casts = [
        'name' => 'array',
        'info' => 'array',
    ];

    public function parentPlan()
    {
        return $this->belongsToMany(StudyPlan::class, 'study_plan_has_plans', 'child_plan_id','parent_plan_id')
            ->withPivot('sort')
            ->orderBy('sort');

    }

    public function childPlan()
    {
        return $this->belongsToMany(StudyPlan::class, 'study_plan_has_plans', 'parent_plan_id', 'child_plan_id')
            ->withPivot('sort')
            ->orderBy('sort');
    }

    public function articles()
    {
        return $this->belongsToMany(Article::class, 'study_plan_has_articles', 'plan_id', 'article_id')
            ->withPivot('sort')
            ->orderBy('sort');
    }

    public function blocks()
    {
        return $this->morphMany(QuestionBlock::class, 'blockable');
    }
}
