<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User ;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
 /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
//        $this->middleware('auth:api', ['except' => ['login']]);
    
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    // public function login()
    // {
    //     $credentials = request(['email', 'password']);

    //     if (! $token = auth()->attempt($credentials)) {
    //         return response()->json(['error' => 'Unauthorized'], 401);
    //     }
    //     $user = auth()->user();
    //     $role = $user->role;
    //     return $this->respondWithToken($token,$role);
    //     // $token = $user->createToken('access_token')->plainTextToken;
    //     // if (!$token) {
    //     //     return response()->json(['error' => 'Unauthorized'], 401);
    //     // }
    
    //     // return response()->json([
    //     //     'token' => $token,
    //     //     'Type' => 'Bearer',
    //     //     'role' => $user->role 
    //     // ]);


        
    // }


public function login()
{
    $credentials = request(['email', 'password']);

    try {
        if (! $token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    } catch (JWTException $e) {
        return response()->json(['error' => 'Could not create token'], 500);
    }
    
    $user = auth()->user();
    $role = $user->role;

    // Ajoutez le rôle au payload du token
    // JWTAuth::setToken($token)->claims(['role' => $role]);


    $token = JWTAuth::fromUser($user);

// Mettre à jour le token en ajoutant le rôle aux revendications (claims)
$payload = JWTAuth::setToken($token)->claims(['role' => $role])->getPayload();

// Récupérer le token mis à jour
$updatedToken = JWTAuth::fromUser($user, $payload->toArray());

return $this->respondWithToken($updatedToken);

    return $this->respondWithToken($updatedToken);
}



    // public function signup(Request $request){
    //     // Validate the request data
    //     $validated = $request->validate([
    //         'firstname' => 'required|string|min:3',
    //         'lastname' => 'required|string|min:3',
    //         'email' => 'required|email|unique:users',
    //         'password' => 'required|string|min:6',
    //         'role' => 'in:admin,user',
    //     ]);
    //     $userData = array_merge($data, ['role' => $data['role'] ?? 'user']);
    //     $user = User::create($validated);
        

    //     return response()->json([
    //         'message' => 'User successfully registered',
    //         'user' => $user 
    //     ], 201);
    // }
    public function signup(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'firstname' => 'required|string|min:3',
            'lastname' => 'required|string|min:3',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'sometimes|nullable|in:admin,user',
        ]);

        // Hash the password
        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user
        ], 201);
    }
        

    public function getAdmin(Request $request){
        $user = User::find(1);
    
        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user
        ], 201);
    }

    public function index()
    {
        $users = User::all();
        return response()->json([
            'message' => 'Users retrieved successfully',
            'users' => $users
        ], 200);
    }
    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,

        ]);
    }
    // public function index()
    // {
    //     return $this->user->all();
    // }

   
    public function show(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        return response()->json($user);
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'firstname' => 'sometimes|string|min:3',
            'lastname' => 'sometimes|string|min:3',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|in:admin,user',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User successfully updated',
            'user' => $user
        ]);
    }

    public function destroy(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'User successfully deleted']);
    }
}