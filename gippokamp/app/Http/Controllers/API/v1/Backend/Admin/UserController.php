<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Enums\ResponseError;
use App\Http\Requests\UserRequests\UserCreateRequest;
use App\Http\Requests\UserRequests\UserEditRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\UserService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $users = (new UserRepository())->index($request->get('params'), $request->get('search'), $request->get('perPage'));
        return UserResource::collection($users);
    }

    public function show(string $uuid)
    {
        $result = (new UserRepository())->show($uuid);
        if ($result['status']){
            return $this->successResponse(__($result['message']), UserResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), 400);
    }

    public function update(UserEditRequest $request, string $uuid)
    {
        $result = (new UserService())->update($request->validated(), $uuid);
        if ($result['status']){
            return $this->successResponse(__($result['message']), UserResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), 400);
    }

    public function statistics()
    {
        $users_count = User::whereHas('roles', function ($query) {
            $query->where('name', 'user');
        })->count();

        $users_free_trail = User::where('trial_ends_at', '>', now())->count();

        $users_tariff = User::whereHas('tariffs', function ($query) {
            $query->where('start_date', '<', now())
                ->where('end_date', '>', now());
        })->count();

        return $this->successResponse('success', [
            'users_count' => $users_count,
            'users_free_trail' => $users_free_trail,
            'users_tariff' => $users_tariff,
        ]);
    }
}
