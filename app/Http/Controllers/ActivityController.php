<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Activity;

class ActivityController extends Controller
{
    protected $activity;
    public function __construct(){
        $this->activity = new Activity();
        
    }
    public function index(Request $request)
    {
        $resultId = $request->query('result_id');
        if ($resultId) {
            return $this->activity->where('result_id', $resultId)->get();
        } else {
            return $this->activity->all();
        }
    }
    
    public function store(Request $request)
    {
     return $this->activity->create($request->all());
    
       
    }
  
    // public function show(string $id)
    // {
    //  $activity = $this->activity->find($id);  
    // }
    public function show(string $id)
{
    $activity = $this->activity->find($id);
    return response()->json($activity);
}
    /*pour le tester http://127.0.0.1:8000/api/activity/5 */

    public function update(Request $request, string $id)
    {
         $activity = $this->activity->find($id);
         $activity->update($request->all());
         return $activity;
    }
    public function destroy(string $id)
    {
     $activity = $this->activity->find($id);
    return $activity->delete();   
    }
}


// <?php
// namespace App\Http\Controllers;
// use Illuminate\Http\Request;
// use App\Models\activity;
// class activityController extends Controller
// {

// }