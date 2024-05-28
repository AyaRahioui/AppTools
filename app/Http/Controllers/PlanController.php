<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Plan;
use App\Models\TerrainPlan;
use App\Models\OfficePlan;
class PlanController extends Controller
{
    protected $plan;

    public function __construct()
    {
        // $this->plan = new TerrainPlan();


        // {
        //     "category": "terrainPlan",
        //     "result": "some result",
        //     "label": "some label",
        //     "zone_intervention": "some zone intervention",
        //     "actor": "some actor",
        //     "date": "2023-03-14",
        //     "descriptif": "some description"
        //   }


        //   {
        //     "category": "officePlan",
        //     "actor": "some actor",
        //     "date": "2023-03-14",
        //     "descriptif": "some description"
        //   }


        //on peut faire 
    //    {
    //         "category": "officePlan",
    //         "result": "some result",
    //         "label": "some label",
    //         "zone_intervention": "some zone intervention",
    //         "actor": "some actor",
    //         "date": "2023-03-14",
    //         "descriptif": "some description"
    //       } 
    /*mais il va remplir seulement les cases de  "category" de "officePlan" */
    }


    
    public function index(Request $request)
    {

        //get http://127.0.0.1:8000/api/plan
        //selon body
//          {
//               "category": "terrainPlan"
//          }

        $category = $request->input('category');

        if ($category === 'terrain') {
            $plans = TerrainPlan::all();
        } elseif ($category === 'office') {
            $plans = OfficePlan::all();
        } else {
            $plans = Plan::all();
        }

        return response()->json($plans);
    }




    /* public function index(Request $request)
    {
        $category = $request->input('category');

        if ($category === 'terrainPlan') {
            $plans = TerrainPlan::all();
        } elseif ($category === 'officePlan') {
            $plans = OfficePlan::all();
        } else {
            $plans = Plan::all();
        }

        return response()->json($plans);
    } */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'category' => 'required|in:terrain,office',
            'result' => $request->input('category') === 'terrain' ? 'required' : '',
            'label' => $request->input('category') === 'terrain' ? 'required' : '',
            'zone_intervention' => $request->input('category') === 'terrain' ? 'required' : '',
            'actor' => 'required',
            'date' => 'required',
            'descriptif' => 'required',
        ]);
    
        $plan = null;
    
        if ($validatedData['category'] === 'terrain') {
            $plan = TerrainPlan::create([
                'result' => $validatedData['result'],
                'label' => $validatedData['label'],
                'zone_intervention' => $validatedData['zone_intervention'],
                'actor' => $validatedData['actor'],
                'date' => $validatedData['date'],
                'descriptif' => $validatedData['descriptif'],
            ]);
        } elseif ($validatedData['category'] === 'office') {
            $plan = OfficePlan::create([
                'actor' => $validatedData['actor'],
                'date' => $validatedData['date'],
                'descriptif' => $validatedData['descriptif'],
            ]);
        }

    
        if (!$plan) {
            return response()->json(['message' => 'Failed to create plan'], 500);
        }
    
        return response()->json($plan, 201);
    }
    
    
    public function show(string $id)
    {
        $plan = $this->plan->where('category', 'terrain')->orWhere('category', 'office')->find($id);

        if (!$plan) {
            return response()->json(['message' => 'Plan not found'], 404);
        }

        return response()->json($plan);
    }

    // public function update(Request $request, string $id)
    // {
    //     $plan = $this->plan->where('category', 'terrain')->orWhere('category', 'office')->find($id);

    //     if (!$plan) {
    //         return response()->json(['message' => 'Plan not found'], 404);
    //     }

    //     $validatedData = $request->validate([
    //         'category' => 'sometimes|required|in:terrain,office',
    //         'result_id' => 'sometimes|required|exists:results,id',
    //         'label' => 'sometimes|required',
    //         'zone_intervention' => 'sometimes|required',
    //         'actor' => 'sometimes|required',
    //         'date' => 'sometimes|required',
    //         'descriptif' => 'sometimes|required',
    //     ]);

    //     $plan->update($validatedData);

    //     return response()->json($plan);
    // }

    public function update(Request $request, string $id)
    {
        // Determine the type of plan to update based on the existing record
        $category = $request->input('category');
        $plan = null;
    
        if ($category === 'terrain') {
            $plan = TerrainPlan::find($id);
        } elseif ($category === 'office') {
            $plan = OfficePlan::find($id);
        } else {
            return response()->json(['message' => 'Invalid category'], 400);
        }
    
        // Check if the plan exists
        if (!$plan) {
            return response()->json(['message' => 'Plan not found'], 404);
        }
    
        // Validate the incoming request data
        $validatedData = $request->validate([
            'category' => 'sometimes|required|in:terrain,office',
            'result' => 'sometimes|required_if:category,terrain',
            'label' => 'sometimes|required_if:category,terrain',
            'zone_intervention' => 'sometimes|required_if:category,terrain',
            'actor' => 'sometimes|required',
            'date' => 'sometimes|required|date',
            'descriptif' => 'sometimes|required',
        ]);
    
        // Update the plan with validated data
        $plan->update($validatedData);
    
        return response()->json($plan, 200);
    }
       
    public function destroy(Request $request, string $id)
    {
        // Get the category from the query parameters
        $category = $request->query('category');
        $plan = null;
    
        // Find the plan based on the category
        if ($category === 'terrain') {
            $plan = TerrainPlan::find($id);
        } elseif ($category === 'office') {
            $plan = OfficePlan::find($id);
        } else {
            return response()->json(['message' => 'Invalid category'], 400);
        }
    
        // Check if the plan exists
        if (!$plan) {
            return response()->json(['message' => 'Plan not found'], 404);
        }
    
        // Attempt to delete the plan
        if ($plan->delete()) {
            return response()->json(['message' => 'Plan deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to delete plan'], 500);
        }
    }
    
    
}