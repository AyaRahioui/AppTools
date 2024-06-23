<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    protected $project;

    public function __construct(Project $project){
        $this->project = $project;
    }

    public function index()
    {
        return response()->json($this->project->all(), 200);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|in:Wash,Dev_rural,Dev_communautaire,Charité,Aménagement,Education,Santé,Autre',
            'date' => 'required|string',
            'zi' => 'required|string',
            'activity' => 'required|string',
            'nb_init' => 'required|string',
            'nbBeneficiaryTotal' => 'required|integer',
            'nbBeneficiaryM' => 'required|integer',
            'nbBeneficiaryF' => 'required|integer',
            'imgs' => 'nullable|json',
            'pdf' => 'nullable|string',
            'description' => 'nullable|string',
            'observation' => 'nullable|string'
        ]);
    
        $project = Project::create($validated);
    
        return response()->json([
            'message' => 'Project successfully registered',
            'project' => $project
        ], 201);
    }
    
    public function show(string $id)
    {
        $project = $this->project->find($id);
        if ($project) {
            return response()->json($project, 200);
        } else {
            return response()->json(['message' => 'Project not found'], 404);
        }
    }

    public function getProjectsByName(string $name)
    {
        $projects = Project::where('name', $name)->get()->map(function ($project) {
            $project->imgs = json_decode($project->imgs); // Decode JSON string to array
            return $project;
        });
        return response()->json($projects, 200);
    }
    public function countProjectsByName(string $name)
    {
        $count = Project::where('name', $name)->count();
        return response()->json(['count' => $count], 200);
    }
    
    public function update(Request $request, string $id)
    {
        $project = $this->project->find($id);
        if ($project) {
            $validated = $request->validate([
                'name' => 'required|string|in:Wash,Dev_rural,Dev_communautaire,Charité,Aménagement,Education,Santé,Autre',
                'date' => 'required|string',
                'zi' => 'required|string',
                'activity' => 'required|string',
                'nb_init' => 'required|string',
                'nbBeneficiaryTotal' => 'required|integer',
                'nbBeneficiaryM' => 'required|integer',
                'nbBeneficiaryF' => 'required|integer',
                'imgs' => 'nullable|json',
                'pdf' => 'nullable|string',
                'description' => 'nullable|string',
                'observation' => 'nullable|string'
            ]);

            $project->update($validated);

            return response()->json([
                'message' => 'Project successfully updated',
                'project' => $project
            ], 200);
        } else {
            return response()->json(['message' => 'Project not found'], 404);
        }
    }

    public function destroy(string $id)
    {
        $project = $this->project->find($id);
        if ($project) {
            $project->delete();
            return response()->json(['message' => 'Project successfully deleted'], 200);
        } else {
            return response()->json(['message' => 'Project not found'], 404);
        }
    }
}
