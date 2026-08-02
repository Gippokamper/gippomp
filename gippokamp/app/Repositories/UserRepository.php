<?php

namespace App\Repositories;

use App\Enums\ResponseError;
use App\Http\Resources\UserResource;
use App\Models\User;

class UserRepository extends BaseRepository
{
    public function index($params, $search, $perPage)
    {
        if (!is_null($params) || !is_null($search)){
            $users = User::when($search, function ($query) use ($search) {
                $query->where('firstname', 'like', '%' . $search . '%')
                    ->orWhere('lastname', 'like', '%' . $search . '%')
                    ->orWhere('phone', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
                })
                ->when($params, function ($query) use ($params){
                    $query->when($params['profession'], function ($query) use ($params){
                        $query->where('profession', $params['profession']);
                    });
                })
                ->paginate($perPage ?? config('app.paginate'));
        }else{
            $users = User::orderBy('id')
                ->paginate($perPage ?? config('app.paginate'));
        }
        return $users;
    }

    public function show(string $uuid)
    {
        $user = User::firstWhere('uuid', $uuid);
        if ($user) {
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $user];
        }
        return ['status' => false, 'code' => 404, 'message' => ResponseError::ERROR_404->value];
    }
}
