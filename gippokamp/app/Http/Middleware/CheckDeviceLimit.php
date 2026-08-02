<?php

namespace App\Http\Middleware;

use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckDeviceLimit
{
    use ApiResponse;
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth('sanctum')->user();
        if ($user && $user->getRoleAttribute() === 'user') {
            $deviceCount = $user->devices()->count();
            $devices = $user->devices()->get();
            if ($user->getRoleAttribute() == 'user' && $deviceCount > 3) {
                return $this->errorResponse(400, 'Device limit reached');
            }
        }
        return $next($request);
    }
}
