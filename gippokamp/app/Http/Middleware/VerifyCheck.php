<?php

namespace App\Http\Middleware;

use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyCheck
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
        if (!auth('sanctum')->user() ||
            (auth('sanctum')->user() instanceof MustVerifyEmail &&
                ! auth('sanctum')->user()->hasVerifiedEmail())) {

            return $this->errorResponse(
                ResponseError::ERROR_105->name,
                trans(ResponseError::ERROR_105->value, [], request()->lang ?? config('app.locale')),
                Response::HTTP_UNAUTHORIZED);
        }
        return $next($request);
    }
}
