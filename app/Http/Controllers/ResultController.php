<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Result;
use Illuminate\Validation\Rule;

class ResultController extends Controller
{
    protected $result;

    public function __construct()
    {
        $this->result = new Result();
    }

    public function index()
    {
        return $this->result->all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|regex:/^r\d+$/|unique:results,name'
        ]);

        return $this->result->create($request->all());
    }

    public function show(string $id)
    {
        $result = $this->result->find($id);
        return response()->json($result);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => [
                'required',
                'regex:/^r\d+$/',
                Rule::unique('results')->ignore($id)
            ]
        ]);

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
