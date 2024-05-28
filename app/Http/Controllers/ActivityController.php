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
            return response()->json($this->activity->where('result_id', $resultId)->get());
        } else {
            return response()->json($this->activity->all());
        }
    }
    
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'dueDate' => 'required|array',  // Ensure it is an array
            'label' => 'required|string|max:255',
            'result_id' => 'required|exists:results,id',
        ]);

        $activity = $this->activity->create($validatedData);
        return response()->json($activity, 201);
    }
    
    public function show(string $id)
    {
        $activity = $this->activity->find($id);

        if ($activity) {
            return response()->json($activity);
        } else {
            return response()->json(['message' => 'Activity not found'], 404);
        }
    }

    public function update(Request $request, string $id)
    {
        $activity = $this->activity->find($id);

        if ($activity) {
            $validatedData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'dueDate' => 'sometimes|required|array',  // Ensure it is an array
                'label' => 'sometimes|required|string|max:255',
                'result_id' => 'sometimes|required|exists:results,id',
            ]);

            $activity->update($validatedData);
            return response()->json($activity);
        } else {
            return response()->json(['message' => 'Activity not found'], 404);
        }
    }

    public function destroy(string $id)
    {
        $activity = $this->activity->find($id);

        if ($activity) {
            $activity->delete();
            return response()->json(['message' => 'Activity deleted successfully']);
        } else {
            return response()->json(['message' => 'Activity not found'], 404);
        }
    }

    public function getDueReminders()
    {
        $now = \Carbon\Carbon::now();
        $activities = Activity::whereJsonContains('dueDate', $now->month)->get();

        return response()->json($activities);
    }
}
