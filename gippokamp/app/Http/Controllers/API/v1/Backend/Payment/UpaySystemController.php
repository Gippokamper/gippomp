<?php

namespace App\Http\Controllers\API\v1\Backend\Payment;

use App\Models\Balance;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class UpaySystemController extends Controller
{

    private $transaction;
    private $user;

    /**
     * UpaySystemController constructor.
     */

    public function __construct(Transaction $transaction, User $user)
    {
        $this->transaction = $transaction;
        $this->user = $user;
    }

    public function check(Request $request){

        \Log::info('PAYMENT', $request->all());
        $accessToken = md5($request->personalAccount . config('services.upay.key')); // Генирация токена md5 {key + personalAccount}
        if (hash_equals($accessToken, (string) $request->accessToken)){
            $user = $this->user->find($request->personalAccount);

            if ($user){
                return response()->json([
                    'status' => 0,
                    'message' => "Успешно",
                    'balance' => $user->balance/100 ?? 0,
                    'fullname' => $user->firstname .' '. $user->lastname,
                ]);
            } else {
                return response()->json(['status' => 1, 'message' => 'Пользователь не найден']);
            }
        } else {
            return response()->json(['status' => 4, 'message' => "Неверный токен"]);
        }
    }

    public function pay(Request $request){
        $accessToken = md5($request->upayTransId . config('services.upay.key') . $request->personalAccount . $request->upayPaymentAmount); // Генирация токена md5 {key + personalAccount}

        if (hash_equals($accessToken, (string) $request->accessToken)){
            $user = $this->user->find($request->personalAccount);
            if ($user){
                $transaction = $this->transaction->where('payment_sys_id', $request->upayTransId)->first();
                if ($transaction){
                    return response()->json(['status' => 10, 'message' => "Транзация уже существует"]);
                }

                $transaction = DB::transaction(function () use ($request, $user) {
                    $transaction = $this->transaction->create([
                        'user_id' => $request->personalAccount,
                        'payment_sys_id' => $request->upayTransId,
                        'payment_sys' => 'UPay',
                        'amount' => $request->upayPaymentAmount * 100,
                        'status' => 2,
                    ]);

                    $user->credit($transaction->amount);
                    $message = 'Balansingiz ' . substr_replace($transaction->amount,'.',-2,0) .
                        ' so\'mga to\'ldirildi. Hozirda balansingiz '. substr_replace($user->balance,'.',-2,0).' so\'m.';
                    Balance::message($user->id, $message);

                    return $transaction;
                });

                if($transaction){
                    return response()->json(['status' => 0, 'message' => "Успешно"]);
                }
            } else {
                return response()->json(['status' => 1, 'message' => 'Пользователь не найден']);
            }
        } else {
            return response()->json(['status' => 4, 'message' => "Неверный токен"]);
        }
        return response()->json(['status' => 15, 'message' => "Неправильные параметры"]);
    }
}
