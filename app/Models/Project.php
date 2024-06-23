<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'date',
        'zi',
        'activity',
        'nb_init',
        'nbBeneficiaryTotal',
        'nbBeneficiaryM',
        'nbBeneficiaryF',
        'imgs',
        'pdf',
        'description',
        'observation'
    ];

    protected $casts = [
        'imgs' => 'array',
    ];
}
