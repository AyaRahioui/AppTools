<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\PlanController;
use Illuminate\Support\Facades\Validator; 
use app\module\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});





Route::group(['middleware' => 'api'], function ($router) {
    Route::post('signup', [AuthController::class,'signup']);

    
    Route::middleware('jwt')->group(function () {
      // Route pour obtenir les informations de l'utilisateur authentifié
  
  });
  Route::get('getme', [AuthController::class, 'getAdmin']);

  //  Route::post('login', 'AuthController@login');
    Route::post('login', [AuthController::class,'login']);//comme app.post with express  
 //   Route::post('logout', 'AuthController@logout');
   // Route::post('refresh', 'AuthController@refresh');
    //Route::post('me', 'AuthController@me');
    
    Route::apiResource('/result', ResultController::class);
    Route::apiResource('/activity', ActivityController::class);
    Route::apiResource('/plan', PlanController::class);
    // Route::get('results','ResultController@getResult');
    // Route::post('addresult', 'ResultController@addResult');

});