<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TermHasTariff extends Model
{
    use HasFactory;
    protected $fillable = [
        'term_id',
        'tariff_id',
        'sort',
    ];
}
