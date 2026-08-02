<?php

namespace App\Http\Controllers\API\v1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RefreshTokenController extends Controller
{
    use ApiResponse;

    public function refresh(Request $request)
    {
        try {
            $user = auth('sanctum')->user();
            if (!$user) {
                return $this->errorResponse(401, 'Unauthorized', 401);
            }
            $user->load(['tariffs', 'wallet']);
            // Eslatma: eski api_token'larni bu yerda O'CHIRMAYMIZ — aks holda hozir ishlatilayotgan
            // token bekor bo'lib, parallel so'rovlar 401 olib, foydalanuvchi login'ga uloqtiriladi.
            $accessToken = $user->createToken('api_token')->plainTextToken;

            /* расчет даты окончания тарифа — faqat haqiqiy tarif bo'lsa (aks holda null) */
            $lastDay = $user->tariffs()
                ->wherePivot('end_date', '>', now())
                ->max('end_date');
            $tariffEnd = null;
            if ($lastDay) {
                $lastDay = Carbon::parse($lastDay);
                $currentDate = Carbon::now();
                $tariff_end_days = $lastDay->diffInDays($currentDate);
                $tariff_end_hours = $lastDay->diffInHours($currentDate) - ($tariff_end_days * 24);
                if ($tariff_end_days <= 3) {
                    $tariffEnd = $tariff_end_days . " days, $tariff_end_hours h";
                }
            }

            return $this->successResponse('success', [
                'access_token' => $accessToken,
                'user' => UserResource::make($user),
                'token_type' => 'Bearer',
                'tariff_end_days' => $tariffEnd,
            ]);
        }catch (\Exception $e){
            return $this->errorResponse(400, $e->getMessage(), 400);
        }
    }
}
