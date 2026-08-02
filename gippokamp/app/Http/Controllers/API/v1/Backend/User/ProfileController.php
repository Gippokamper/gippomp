<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Requests\UserRequests\UserEditRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\UserResource;
use App\Models\Article;
use App\Models\ArticleRead;
use App\Services\ArticleService;
use App\Services\UserService;
use Illuminate\Http\Request;

class ProfileController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function show()
    {
        try {
            $user = auth('sanctum')->user();
            return $this->successResponse('success', UserResource::make($user->load('university', 'region', 'wallet')));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

   public function update(UserEditRequest $request)
   {
       $result = (new UserService())->update($request->validated(), auth('sanctum')->user()->uuid);
       if ($result['status']){
           return $this->successResponse(__($result['message']), UserResource::make($result['data']));
       }
       return $this->errorResponse($result['code'], __($result['message']), $result['code']);
   }
}
