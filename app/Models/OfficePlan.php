<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model\Plan;
use App\Models\Plan;
class OfficePlan extends Plan {
    protected $fillable = [
        'actor',
        'date',
        'descriptif',
    ];
    use HasFactory;
}
