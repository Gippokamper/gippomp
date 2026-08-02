<?php

namespace App\Http\Controllers\API\v1\Auth;

use App\Enums\ResponseError;
use App\Helpers\Utility;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\DeviceResource;
use App\Http\Resources\UserResource;
use App\Models\Device;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Jenssegers\Agent\Agent;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends Controller
{
    use ApiResponse;

    public function login(LoginRequest $request)
    {
        try {
            $validated = $request->validated();
            $validated['phone'] = Utility::replacePhone($validated['phone']);
            if (!Auth::attempt($validated)) {
                return $this->errorResponse(400, trans(ResponseError::ERROR_LOGIN->value, [], request()->lang), 400);
            }

            $user = auth('sanctum')->user()->load('tariffs');

            /* устройства */
            $userAgent = $request->userAgent() ?? 'unknown';
            $device = $user->devices()->where('name', $userAgent)->first();
            if (is_null($device) && $user->getRoleAttribute() == 'user') {
                // Qurilma limiti: 4 tadan oshsa, login to'xtatiladi.
                if ($user->devices()->count() >= 4) {
                    return $this->errorResponse(403, 'Device limit reached', 403);
                }
                $agent = new Agent();
                $agent->setUserAgent($userAgent);

                $device_type = $agent->isDesktop() ? 'desktop' : ($agent->isTablet() ? 'tablet' : 'mobile');
                $device_model = $agent->device();
                $device_browser = $agent->browser();

                if ($device_model == 'WebKit') {
                    $device_model = $device_model . ' PC';
                }

                $device = $user->devices()->create([
                    'user_id' => $user->id,
                    'name' => $userAgent,
                    'view_name' => $device_model . ' ' . $device_browser,
                    'type' => $device_type,
                ]);
            } elseif (!is_null($device)) {
                // json_extract — SQLite va MySQL ikkalasida ham ishlaydi (whereJsonContains SQLite'da yo'q).
                $user->tokens()->whereRaw("json_extract(abilities, '$.device_id') = ?", [$device->id])->delete();
            }

            /* разрешения */
            $permissions = [];
            if ($user->onTrial()){
                $permissions = ['articles', 'videos', 'tests', 'info', 'offline'];
            } elseif ($user->hasActiveTariff()){
                $permissions = ['articles', 'videos', 'offline'];
                foreach ($user->actualTariffs() as $tariff){
                    if ($tariff->name['en'] == 'Premium'){
                        $permissions = ['articles', 'videos', 'tests', 'info', 'offline'];
                    }
                }
            }else{
                $permissions = ['videos'];
            }

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

            /* токены */
            $accessToken = $user->createToken('api_token', ['device_id' => $device ? $device->id : 0])->plainTextToken;
            $refreshToken = $user->createToken('refresh_token', ['device_id' => $device ? $device->id : 0])->plainTextToken;

            return $this->successResponse($message ?? 'success', [
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'self_device' => $user->getRoleAttribute() == 'user' && $device ? $device->id : 0,
                'devices' => $user->getRoleAttribute() == 'user' && $device ? DeviceResource::collection($user->devices()->where('id', '!=', $device->id)->get()) : DeviceResource::collection($user->devices()->get()),
                'token_type' => 'Bearer',
                'tariff_end_days' => $tariffEnd,
                'user' => UserResource::make(auth('sanctum')->user()),
                'user_permissions' => $permissions
            ]);
        }catch (\Exception $e){
            return $this->errorResponse(400, $e->getMessage(), 400);
        }
    }
    public function logout(Request $request)
    {
        try {
            // Sanctum tokenini haqiqatan bekor qilamiz (Auth::logout token guard'da ishlamaydi).
            $request->user()->currentAccessToken()->delete();
            return $this->successResponse('success');
        }catch (\Exception $e){
            return $this->errorResponse(400, $e->getMessage(), 400);
        }
    }
}
