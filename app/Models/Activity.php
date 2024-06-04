<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $table = 'activities';
 protected $primaryKey = 'id';

    protected $fillable = ['name', 'description', 'dueDate', 'label' ,'result_id'];
    protected $casts = [
        'dueDate' => 'array',
    ];
   use HasFactory;
   public function result()
   {
       return $this->belongsTo(Result::class);
   }

}
