<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resume extends Model
{
    use HasFactory;
    protected $fillable = [
        'vacancy_id',
        'full_name',
        'birthday',
        'address',
        'email',
        'phone',
        'now_do',
        'study_info',
        'english',
        'german',
        'language_level',
        'stimulus',
        'interest',
        'comment'
    ];
    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class);
    }
}
