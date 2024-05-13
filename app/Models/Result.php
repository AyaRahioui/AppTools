<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Result extends Model
{

     protected $table = 'results';
  protected $primaryKey = 'id';
   protected $fillable = [
        'name',
    ];
    use HasFactory;
    public function activities()
    {
        return $this->hasMany(Activity::class);
    }
}

/*<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    use HasFactory;
}
 */



/*



<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Result;
class ResultController extends Controller
{
    protected $result;
    public function __construct(){
        $this->result = new Result();
        
    }
    public function index()
    {
        return $this->result->all();
     
    }
    
    public function store(Request $request)
    {
     return $this->result->create($request->all());
    
       
    }
  
    public function show(string $id)
    {
     $result = $this->result->find($id);  
    }

    public function update(Request $request, string $id)
    {
         $result = $this->result->find($id);
         $result->update($request->all());
         return $result;
    }
    public function destroy(string $id)
    {
     $result = $this->result->find($id);
    return $result->delete();   
    }
}
*/