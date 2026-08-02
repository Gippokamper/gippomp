<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedbackMessage extends Model
{
    use HasFactory;
    protected $fillable = [
        'feedback_id',
        'author',
        'message',
        'admin_is_read',
        'user_is_read'
    ];
    public function feedback()
    {
        return $this->belongsTo(Feedback::class);
    }
}
