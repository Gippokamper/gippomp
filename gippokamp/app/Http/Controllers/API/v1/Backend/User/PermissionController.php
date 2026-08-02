<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    use ApiResponse;

    public function index()
    {
        try {
            $user = auth('sanctum')->user();

            $permissions = [];
            if ($user->onTrial()){
                $permissions = ['articles', 'videos', 'tests', 'info', 'offline'];
            } elseif ($user->hasActiveTariff()){
                $permissions = ['articles', 'videos', 'offline'];
                foreach ($user->actualTariffs() as $tariff){
                    if ($tariff->name['en'] == 'Premium'){
                        $permissions = ['articles', 'videos', 'tests', 'info', 'offline'];
                    }
                }
            }else{
                $permissions = ['videos'];
            }

            return $this->successResponse('success', [
                'user_permissions' => $permissions ?? null
            ]);
        }catch (\Exception $e){
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }
}
