<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Requests\UserRequests\UserEditRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\DeviceResource;
use App\Http\Resources\UserResource;
use App\Models\Article;
use App\Models\ArticleRead;
use App\Models\Device;
use App\Services\ArticleService;
use App\Services\UserService;
use Illuminate\Http\Request;

class DeviceController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        try {
            $user_id = auth('sanctum')->user()->id;
            $devices = Device::where('user_id', $user_id)->get();
            return $this->successResponse('success', DeviceResource::collection($devices));
        }catch (\Exception $e){
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }
    public function update(Request $request, $id)
    {
        try {
            $userId = auth('sanctum')->user()->id;

            // Faqat o'z qurilmalari ichida bir xil tokenni tozalaymiz.
            Device::where('user_id', $userId)
                ->where('notification_token', $request->get('notification_token'))
                ->update(['notification_token' => null]);

            // Faqat o'ziga tegishli qurilmani yangilash mumkin (IDOR oldini olish).
            $device = Device::where('id', $id)->where('user_id', $userId)->first();

            if ($device) {
                $device->update($request->only('notification_token'));
                return $this->successResponse('success', DeviceResource::make($device));
            } else {
                return $this->errorResponse(404, 'Device not found', 404);
            }
        }catch (\Exception $e){
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }

   public function destroy(int $id)
   {
       try{
           $user = auth('sanctum')->user();
           // Faqat o'ziga tegishli qurilmani o'chirish mumkin (IDOR oldini olish).
           $device = Device::where('id', $id)->where('user_id', $user->id)->first();
           if (!$device) {
               return $this->errorResponse(404, 'Device not found', 404);
           }
           $user->tokens()->whereRaw("json_extract(abilities, '$.device_id') = ?", [$device->id])->delete();
           $device->delete();
           return $this->successResponse('success');
       }catch (\Exception $e){
           return $this->errorResponse(500, $e->getMessage(), 500);
       }
   }
}
