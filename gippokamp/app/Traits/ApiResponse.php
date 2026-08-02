<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

trait ApiResponse
{
    /**
     * Success Response.
     *
     * @param string $message
     * @param array $data
     * @return JsonResponse
     */
    public function successResponse(string $message = '', mixed $data = []): JsonResponse
    {
        return new JsonResponse([
            'timestamp' => now(),
            'message' => $message,
            'data' => $data
        ], Response::HTTP_OK);
    }

    /**
     * Error Response.
     *
     * @param string $code
     * @param string $message
     * @param int $httpCode
     * @param array $params
     * @return JsonResponse
     */
    public function errorResponse(string $code, string $message = '', int $httpCode = Response::HTTP_INTERNAL_SERVER_ERROR, array $params = []): JsonResponse
    {
        return new JsonResponse([
            'code' => $code,
            'message' => $message,
            'params' => $params
        ], $httpCode);
    }
}
