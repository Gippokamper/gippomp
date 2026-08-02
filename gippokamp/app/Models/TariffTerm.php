<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TariffTerm extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'month_count'
    ];
    protected $casts = [
        'name' => 'array'
    ];
    public function tariffs()
    {
        return $this->hasMany(Tariff::class);
    }
}
