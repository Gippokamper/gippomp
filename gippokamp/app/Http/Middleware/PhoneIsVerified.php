<?php

namespace App\Http\Middleware;

use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Request;

class PhoneIsVerified
{
    use ApiResponse;

    public function handle(Request $request, Closure $next)
    {
        if (auth('sanctum')->check() && !auth('sanctum')->user()->isPhoneVerified()) {
            return $this->errorResponse(ResponseError::ERROR_400->value, 'Phone verification', \Illuminate\Http\Response::HTTP_BAD_REQUEST);
        }
        return $next($request);
    }
}
