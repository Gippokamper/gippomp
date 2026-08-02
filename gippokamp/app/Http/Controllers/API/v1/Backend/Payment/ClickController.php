<?php

namespace App\Http\Controllers\API\v1\Backend\Payment;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClickController extends Controller
{

    private $transaction;
    private $user;

    /**
     * ClickController constructor.
     */
    public function __construct(Transaction $transaction, User $user)
    {
        $this->transaction = $transaction;
        $this->user = $user;
    }

    public function check(Request $request){

        \Log::info('CLICK_CHECK', $request->all());
        $md5 = md5($request->click_trans_id . $request->service_id . config('services.click.secret_key') . $request->merchant_trans_id .
            $request->amount . $request->action. $request->sign_time);
        \Log::info('CLICK_CHECK_TOKEN', [$md5]);

//        return response()->json($md5);

        if ($md5 === $request->sign_string) {
            $user = $this->user->find($request->merchant_trans_id);
            if ($user) {
                $transaction = Transaction::create([
                    'payment_sys_id' => $request->click_trans_id,
                    'payment_sys' => 'Click',
                    'click_paydoc_id' => $request->click_paydoc_id,
                    'amount' => $request->amount*100,
                    'perform_time' => Carbon::parse($request->sign_time)->unix(),
                    'user_id' => $request->merchant_trans_id,
                    'status' => 1,
                ]);

                if ($transaction) {
                    $response = [
                        "click_trans_id" => $transaction->payment_sys_id,
                        "merchant_trans_id" => $transaction->user_id,
                        "merchant_prepare_id" => $transaction->id,
                        "error" => '0',
                        "error_note" => "Success",
                    ];
                } else {
                    $response = [
                        "error" => '-1',
                        "error_note" => "Не удалось создать транзакцию",
                    ];
                }
            } else {
                $response = [
                    "error" => '-6',
                    "error_note" => "Пользователь не найден",
                ];
            }
        } else {
            $response = [
                "error" => '-1',
                "error_note" => "Неверный токен",
            ];
        }

        return response()->json($response);
    }

    public function pay(Request $request)
    {
        \Log::info('CLICK_PAY', $request->all());

        $md5 = md5($request->click_trans_id . $request->service_id . config('services.click.secret_key') . $request->merchant_trans_id .
            $request->merchant_prepare_id .  $request->amount . $request->action. $request->sign_time);
        \Log::info('CLICK_PAY_TOKEN', [$md5]);
//        return response()->json($md5);

        if ($md5 === $request->sign_string) {
            $user = $this->user->find($request->merchant_trans_id);
            if ($user) {
                $transaction = \App\Models\Transaction::where('click_paydoc_id', $request->click_paydoc_id)->first();

                if($transaction){
                    if($transaction->status == 1){

                        // Atomik: qayta so'rovda balans ikki marta qo'shilmasligi uchun
                        // tranzaksiyani qulflab, status 1 ekanini qayta tekshiramiz.
                        DB::transaction(function () use ($transaction, $user, $request) {
                            $locked = Transaction::where('id', $transaction->id)->lockForUpdate()->first();
                            if ($locked->status != 1) {
                                return;
                            }
                            $locked->update([
                                'status' => 2,
                                'perform_time' => Carbon::parse($request->sign_time)->unix()
                            ]);

                            $user->credit($locked->amount);
                            $message = 'Balansingiz ' . substr_replace($locked->amount,'.',-2,0) .
                                ' so\'mga to\'ldirildi. Hozirda balansingiz '. substr_replace($user->balance,'.',-2,0).' so\'m.';
                            \App\Models\Balance::message($user->id,$message);
                        });

                        $transaction->refresh();
                        $response = [
                            "click_trans_id" => $transaction->payment_sys_id,
                            "merchant_trans_id" => $transaction->user_id,
                            "merchant_prepare_id" => $transaction->id,
                            "merchant_confirm_id" =>  $transaction->click_paydoc_id,
                            "error" => '0',
                            "error_note" => "Success",
                        ];

                    } elseif($transaction->status == 2){
                        $response = [
                            "error" => "-4",
                            "error_note" => "Транзакция уже оплачена",
                        ];
                    } else {
                        $response = [
                            "error" => "-9",
                            "error_note" => "Транзакция отменена",
                        ];
                    }
                } else {
                    $response = [
                        "error" => '-1',
                        "error_note" => "Не удалось найти транзакцию",
                    ];
                }

            } else {
                $response = [
                    "error" => '-6',
                    "error_note" => "Заказ не найден",
                ];
            }
        } else {
            $response = [
                "error" => '-1',
                "error_note" => "Неверный токен",
            ];
        }
        return response()->json($response);

    }
}
