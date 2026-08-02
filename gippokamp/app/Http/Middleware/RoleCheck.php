<?php

namespace App\Http\Middleware;

use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleCheck
{
    use ApiResponse;

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @param $roles
     * @return Response
     */
    public function handle(Request $request, Closure $next, $roles): Response
    {
        $user = auth('sanctum')->user();
        $roles = explode('|', $roles);
        if ($user && in_array($user->role, $roles)){
            return $next($request);
        }

        return $this->errorResponse(
            Response::HTTP_FORBIDDEN,
            __(ResponseError::ERROR_403->value),
            Response::HTTP_FORBIDDEN);
    }
}
