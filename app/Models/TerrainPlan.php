<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Plan;

class TerrainPlan extends Plan {
    protected $fillable = [     
        'result',
        'label',
        'zone_intervention',
        'actor',
        'date',
        'descriptif',
    ];
    use HasFactory;
}
