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
  
    // public function show(string $id)
    // {
    //  $result = $this->result->find($id);  
    // }
    public function show(string $id)
{
    $result = $this->result->find($id);
    return response()->json($result);
}
    /*pour le tester http://127.0.0.1:8000/api/result/5 */

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


// <?php
// namespace App\Http\Controllers;
// use Illuminate\Http\Request;
// use App\Models\Result;
// class ResultController extends Controller
// {

// }