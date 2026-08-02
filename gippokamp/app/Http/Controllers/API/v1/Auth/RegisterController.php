<?php

namespace App\Http\Controllers\API\v1\Auth;

use App\Helpers\Utility;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequests\StudentRequest\StudentCreateRequest;
use App\Http\Requests\UserRequests\UserCreateRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use App\Traits\ApiResponse;
use App\Traits\SmsTrait;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RegisterController extends Controller
{
    use ApiResponse, SmsTrait;

    public function register(UserCreateRequest $request)
    {
        $result = (new UserService())->store($request->validated());
        if ($result['status']) {

            Auth::login($result['data']);
            $user = auth('sanctum')->user();
            $device = $user->devices()->create([
                'user_id' => $user->id,
                'name' => $request->userAgent() ?? 'unknown',
            ]);

            $accessToken = $user->createToken('api_token', ['device_id' => $device->id])->plainTextToken;
            $refreshToken = $user->createToken('refresh_token')->plainTextToken;
//            $this->send(Utility::replacePhone($request['phone']), 'Gippokamp.uz saytidagi Sizning tasdiqlash kodingiz: ' . $result['data']->verification_code);

            return $this->successResponse('User successfully Register please verification', [
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'token_type' => 'Bearer',
                'user' => UserResource::make(auth()->user()),
            ]);
        }

        return $this->errorResponse(
            $result['code'], $result['message'] ?? trans('errors.' . $result['code'], [], \request()->lang),
            Response::HTTP_BAD_REQUEST
        );
    }
}
