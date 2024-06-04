<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluate extends Model
{
    use HasFactory;

    protected $fillable = [
        'codeRes',
        'label',
        'descriptif',
        'actor',
        'plan',
        'pdf',
        'imgs'
    ];

    protected $casts = [
        'imgs' => 'array',
    ];
}






