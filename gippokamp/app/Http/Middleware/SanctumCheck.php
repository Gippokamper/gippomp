<?php

namespace App\Http\Middleware;

use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanctumCheck
{
    use ApiResponse;

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth('sanctum')->check()) {
            return $next($request);
        }

        return $this->errorResponse(
            Response::HTTP_UNAUTHORIZED,
            __(ResponseError::ERROR_401->value),
            Response::HTTP_UNAUTHORIZED);

    }
}
