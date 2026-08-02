<?php

namespace App\Http\Controllers\API\v1\Auth;

use App\Enums\ResponseError;
use App\Helpers\PhoneHelper;
use App\Helpers\Utility;
use App\Http\Controllers\Controller;
use App\Http\Requests\ForgotPassword\CheckCodeRequest;
use App\Http\Requests\ForgotPassword\NewPasswordRequest;
use App\Http\Requests\ForgotPassword\SendCodeRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\Device;
use App\Models\User;
use App\Traits\ApiResponse;
use App\Traits\SmsTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ForgotPasswordController extends Controller
{
    use ApiResponse, SmsTrait;

    public function sendCode(SendCodeRequest $request)
    {
        $request = $request->validated();
        $phone = Utility::replacePhone($request['phone']);
        $user = User::where('phone', $phone)->first();
        if ($user){
            $code = rand(100000, 999999); // 6 xonali
            $message = 'Gippokamp.uz saytidagi akkauntingizni faollashtirish kodi: ' . $code;
            $this->send($phone, $message);
            $token = Str::uuid();
            $user->update([
                'verification_code' => $code,
                'verification_attempts' => 0,
                'verification_code_expires_at' => now()->addMinutes(5),
                'reset_password_token' => $token
            ]);
            return $this->successResponse('success', ['token' => $token]);
        }
        return $this->errorResponse(404, 'error', 404);
    }

    public function checkCode(CheckCodeRequest $request)
    {
        $request = $request->validated();
        // Faqat token bo'yicha topamiz — kod alohida tekshiriladi (brute-force cheklovi bilan).
        $user = User::where('reset_password_token', $request['token'])->first();

        if (!$user
            || $user->verification_code_expires_at === null
            || now()->greaterThan($user->verification_code_expires_at)) {
            return $this->errorResponse(400, 'Kod eskirgan yoki noto\'g\'ri', 400);
        }
        if ($user->verification_attempts >= 5) {
            return $this->errorResponse(429, 'Juda ko\'p urinish. Yangi kod so\'rang.', 429);
        }
        if ((string) $user->verification_code !== (string) $request['code']) {
            $user->increment('verification_attempts');
            return $this->errorResponse(400, 'Noto\'g\'ri kod', 400);
        }

        $token = Str::uuid();
        $user->update([
            'reset_password_token' => $token,
            'verification_attempts' => 0,
        ]);
        return $this->successResponse('success', ['token' => $token]);
    }

    public function newPassword(NewPasswordRequest $request)
    {
        $request = $request->validated();
        $user = User::where('reset_password_token', $request['token'])->first();

        if (!$user
            || $user->verification_code_expires_at === null
            || now()->greaterThan($user->verification_code_expires_at)
            || (string) $user->verification_code !== (string) $request['code']) {
            return $this->errorResponse(400, 'Kod eskirgan yoki noto\'g\'ri', 400);
        }

        $user->update([
            'password' => $request['password'],
            'verification_code' => null,
            'verification_code_expires_at' => null,
            'reset_password_token' => null,
        ]);
        Auth::login($user);
        return $this->successResponse('success');
    }
}
