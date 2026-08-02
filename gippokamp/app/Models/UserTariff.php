<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserTariff extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'tariff_id',
        'start_date',
        'end_date',
    ];
    public function tariff(): BelongsTo
    {
        return $this->belongsTo(Tariff::class);
    }
}
