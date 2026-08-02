<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Helpers\Utility;
use App\Http\Resources\UserResource;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserService extends BaseService
{
    public function store(array $request)
    {
        $role = Role::firstWhere('name', $request['role']);
        try {
            if (isset($request['image'])) {
                $request['image'] = $this->photo($request['image'], 'img/users');
            }
            $request['phone'] = Utility::replacePhone($request['phone']);
            $request['profession'] = 'student';
            $request['verification_code'] = rand(1000, 9999);;

            $user = User::create($request);
            if ($user) {
                $user->assignRole($role);
                return ['status' => true, 'code' => ResponseError::NO_ERROR->name, 'data' => $user];
            }
            return ['status' => false, 'code' => ResponseError::ERROR_501->name, 'httpCode' => 501];

        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($request, $uuid)
    {
        try {
            $user = User::firstWhere('uuid', $uuid);
            if ($user) {
                $user->update($request);
                return ['status' => true, 'message' => __(ResponseError::NO_ERROR->value), 'data' => UserResource::make($user)];
            }
            return ['status' => false, 'code' => 404, 'message' => __(ResponseError::ERROR_404->value), 'httpCode' => 404];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 404, 'message' => $e->getMessage(), 'httpCode' => 404];
        }
    }
}
