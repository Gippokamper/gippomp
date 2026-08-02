<?php

namespace App\Http\Middleware;

use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTariff
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
        $user = auth('sanctum')->user();
        if (!$user) {
            return $this->errorResponse(Response::HTTP_UNAUTHORIZED, 'Unauthorized', Response::HTTP_UNAUTHORIZED);
        }
        if (!$user->onTrial() && !$user->hasActiveTariff()) {
            // Если пробный период завершился и нет активного тарифа, редирект на страницу оплаты или сообщение
            return $this->errorResponse(ResponseError::ERROR_400->value, 'Trial period is over and no active tariff found', Response::HTTP_BAD_REQUEST);
        }

        return $next($request);
    }
}
