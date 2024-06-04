<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Projet extends Model
{
    use HasFactory;

    // Définir les attributs de la table
    protected $fillable = [
        'nom',
        'date',
        'activity',
        'nb_init',
        'nb_beneficiary',
        'photo',
        'pdf',
    ];

}
