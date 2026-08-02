<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Balance extends Model
{
    use HasFactory;
    protected $guarded = [];

    public static function message($id, $message)
    {
        Balance::create([
            'user_id' => $id,
            'message' => $message
        ]);
    }
}
