<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Activity;
use Illuminate\Validation\Rule;

class ActivityController extends Controller
{
    protected $activity;

    public function __construct()
    {
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
            'name' => [
                'required',
                'string',
                'regex:/^a\d+$/',
                Rule::unique('activities')->where(function ($query) use ($request) {
                    return $query->where('result_id', $request->result_id);
                }),
            ],
            'description' => 'required|string',
            'dueDate' => 'required|array',
            'label' => 'required|string',
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
                'name' => [
                    'sometimes',
                    'required',
                    'string',
                    'regex:/^a\d+$/',
                    Rule::unique('activities')->ignore($id)->where(function ($query) use ($activity) {
                        return $query->where('result_id', $activity->result_id);
                    }),
                ],
                'description' => 'sometimes|required|string',
                'dueDate' => 'sometimes|required|array',
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
