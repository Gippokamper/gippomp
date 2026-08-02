<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tariff extends Model
{
    use HasFactory;
    protected $fillable = [
        'term_id',
        'sort',
        'photo',
        'name',
        'advantages',
        'price'
    ];
    protected $casts = [
        'name' => 'array',
        'advantages' => 'array',
    ];
    public function term()
    {
        return $this->belongsTo(TariffTerm::class, 'term_id');
    }
}
