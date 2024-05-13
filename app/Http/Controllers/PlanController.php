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

        if ($category === 'terrainPlan') {
            $plans = TerrainPlan::all();
        } elseif ($category === 'officePlan') {
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
            'category' => 'required|in:terrainPlan,officePlan',
            'result' => $request->input('category') === 'terrainPlan' ? 'required' : '',
            'label' => $request->input('category') === 'terrainPlan' ? 'required' : '',
            'zone_intervention' => $request->input('category') === 'terrainPlan' ? 'required' : '',
            'actor' => 'required',
            'date' => 'required',
            'descriptif' => 'required',
        ]);
    
        $plan = null;
    
        if ($validatedData['category'] === 'terrainPlan') {
            $plan = TerrainPlan::create([
                'result' => $validatedData['result'],
                'label' => $validatedData['label'],
                'zone_intervention' => $validatedData['zone_intervention'],
                'actor' => $validatedData['actor'],
                'date' => $validatedData['date'],
                'descriptif' => $validatedData['descriptif'],
            ]);
        } elseif ($validatedData['category'] === 'officePlan') {
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
        $plan = $this->plan->where('category', 'terrainPlan')->orWhere('category', 'officePlan')->find($id);

        if (!$plan) {
            return response()->json(['message' => 'Plan not found'], 404);
        }

        return response()->json($plan);
    }

    public function update(Request $request, string $id)
    {
        $plan = $this->plan->where('category', 'terrainPlan')->orWhere('category', 'officePlan')->find($id);

        if (!$plan) {
            return response()->json(['message' => 'Plan not found'], 404);
        }

        $validatedData = $request->validate([
            'category' => 'sometimes|required|in:terrainPlan,officePlan',
            'result_id' => 'sometimes|required|exists:results,id',
            'label' => 'sometimes|required',
            'zone_intervention' => 'sometimes|required',
            'actor' => 'sometimes|required',
            'date' => 'sometimes|required',
            'descriptif' => 'sometimes|required',
        ]);

        $plan->update($validatedData);

        return response()->json($plan);
    }

    public function destroy(string $id)
    {
        $plan = $this->plan->where('category', 'terrainPlan')->orWhere('category', 'officePlan')->find($id);

        if (!$plan) {
            return response()->json(['message' => 'Plan not found'], 404);
        }

        $plan->delete();

        return response()->json(['message' => 'Plan deleted']);
    }
}