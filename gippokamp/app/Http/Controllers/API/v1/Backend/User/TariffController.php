<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Http\Requests\TariffRequests\TariffDeleteRequest;
use App\Http\Requests\TariffRequests\TariffRequest;
use App\Http\Resources\TariffResource;
use App\Http\Resources\TermResource;
use App\Http\Resources\UserTariffResource;
use App\Models\Balance;
use App\Models\Tariff;
use App\Models\TariffTerm;
use App\Models\UserTariff;
use App\Services\TariffService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TariffController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function terms(Request $request)
    {
        $terms = TariffTerm::orderBy('id')->get();
        return TermResource::collection($terms);
    }

    public function index(Request $request)
    {
        $tariffs = Tariff::with('term')
            ->orderBy('id')
            ->paginate($request->get('perPage') ?? 12);
        return TariffResource::collection($tariffs);
    }

    public function history(Request $request)
    {
        // Faqat joriy foydalanuvchining o'z tarix yozuvlari (IDOR oldini olish).
        $tariffs = UserTariff::with('tariff')
            ->where('user_id', auth('sanctum')->user()->id)
            ->orderBy('id', 'desc')
            ->paginate($request->get('perPage') ?? 12);
        return UserTariffResource::collection($tariffs);
    }

    public function buy(int $id)
    {
        $tariff = Tariff::with('term')->find($id);
        $user = auth('sanctum')->user();

        if (!$tariff) {
            return $this->errorResponse(404, 'Tariff not found', 404);
        }

        $wallet = $user->wallet()->firstOrCreate(['user_id' => $user->id]);

        if ($wallet->amount >= $tariff->price){

            $startDate = now();
            $endDate = $startDate->copy()->addMonth($tariff->term->month_count);

            DB::transaction(function () use ($user, $wallet, $tariff, $startDate, $endDate) {
                UserTariff::create([
                    'user_id' => $user->id,
                    'tariff_id' => $tariff->id,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ]);
                $wallet->decrement('amount', $tariff->price);
                $wallet->refresh();
                Balance::create([
                   'user_id' => $user->id,
                    'message' => collect([
                        'ru' => " За тариф " . $tariff['name']['ru'] . "с вашего счета было списано" . $tariff->price . " сум. На вашем балансе осталось " . $wallet->amount . " сум.",
                        'uz' => $tariff['name']['uz'] . " tarifi uchun hisobingizdan " . $tariff->price . " so'm yechib qolindi. Hozirda balansingiz " . $wallet->amount . " so'm.",
                        'en' => $tariff->price . " sum was charged for the " . $tariff['name']['en'] . " tariff. There are " . $wallet->amount . " sum left on your balance",
                    ]),
                    'amount' => $tariff->price,
                ]);
            });
            return $this->successResponse('Tariff is connected');
        } else {
            return $this->errorResponse(403, 'Not enough money!', 403);
        }

    }
}
