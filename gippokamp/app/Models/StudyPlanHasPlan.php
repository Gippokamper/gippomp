<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudyPlanHasPlan extends Model
{
    use HasFactory;
    protected $fillable = [
        'parent_plan_id',
        'child_plan_id',
        'sort',
    ];
}
