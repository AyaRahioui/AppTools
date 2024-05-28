<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_id',
        'date',
        'result_id',
    ];

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
}
