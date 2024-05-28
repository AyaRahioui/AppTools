<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evaluate;

class EvaluateController extends Controller
{
    protected $evaluate;

    public function __construct(){
        $this->evaluate = new Evaluate();
    }

    public function index()
    {
        return $this->evaluate->all();
    }

    public function store(Request $request){
        // Validate the request data
        $validated = $request->validate([
            'codeRes' => 'required|string|min:3',
            'label' => 'required|string|min:3',
            'descriptif' => 'required|string|min:3',
            'plan' => 'nullable|string',
            'pdf' => 'nullable|string',
            'imgs' => 'nullable|json'
        ]);

        $evaluate = Evaluate::create($validated);

        return response()->json([
            'message' => 'Evaluate successfully registered',
            'evaluate' => $evaluate
        ], 201);
    }

    public function show(string $id)
    {
        $evaluate = $this->evaluate->find($id);
        if ($evaluate) {
            return response()->json($evaluate);
        } else {
            return response()->json(['message' => 'Evaluate not found'], 404);
        }
    }

    public function update(Request $request, string $id)
    {
        $evaluate = $this->evaluate->find($id);
        if ($evaluate) {
            $validated = $request->validate([
                'codeRes' => 'required|string|min:3',
                'label' => 'required|string|min:3',
                'descriptif' => 'required|string|min:3',
                'plan' => 'nullable|string',
                'pdf' => 'nullable|string',
                'imgs' => 'nullable|json'
            ]);

            $evaluate->update($validated);

            return response()->json([
                'message' => 'Evaluate successfully updated',
                'evaluate' => $evaluate
            ], 200);
        } else {
            return response()->json(['message' => 'Evaluate not found'], 404);
        }
    }

    public function destroy(string $id)
    {
        $evaluate = $this->evaluate->find($id);
        if ($evaluate) {
            $evaluate->delete();
            return response()->json(['message' => 'Evaluate successfully deleted'], 200);
        } else {
            return response()->json(['message' => 'Evaluate not found'], 404);
        }
    }
}
