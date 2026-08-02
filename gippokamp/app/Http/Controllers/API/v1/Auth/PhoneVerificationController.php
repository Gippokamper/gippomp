<?php

namespace App\Http\Controllers\API\v1\Auth;

use App\Enums\ResponseError;
use App\Helpers\Utility;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\Device;
use App\Traits\ApiResponse;
use App\Traits\SmsTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class PhoneVerificationController extends Controller
{
    use ApiResponse, SmsTrait;

    public function verification(Request $request)
    {
        $user = auth('sanctum')->user();
        if (!$user->isPhoneVerified()){
            $code = rand(1000, 9999);
            $user->update([
                'verification_code' => $code
            ]);
            $this->send($user->phone, 'Gippokamp.uz saytidagi Sizning tasdiqlash kodingiz: ' . $code);
            return $this->successResponse('verification');
        }
        return $this->successResponse('Phone was verified');
    }

    public function verificationCheck(Request $request)
    {
        $user = auth('sanctum')->user();
        if (!isset($request->code)) {
            return $this->errorResponse('Code not received');
        }

        if ($user->verification_attempts >= 3) {
            $code = rand(1000, 9999);
            $user->update([
                'verification_attempts' => 0,
                'verification_code' => $code
            ]);
            $this->send($user->phone, 'Gippokamp.uz saytidagi Sizning tasdiqlash kodingiz: ' . $code);
            return $this->errorResponse('Too many attempts. A new code has been sent.');
        }

        if ($request->code == $user->verification_code) {
            $user->update([
                'verification_code' => null,
                'phone_verified_at' => now(),
                'verification_attempts' => 0  // также сбросить счетчик попыток
            ]);
            return $this->successResponse('verified');
        }

        $user->increment('verification_attempts');
        return $this->errorResponse('Incorrect code');

    }
}
