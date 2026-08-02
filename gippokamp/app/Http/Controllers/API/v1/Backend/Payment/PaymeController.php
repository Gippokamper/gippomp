<?php

namespace App\Http\Controllers\API\v1\Backend\Payment;

use App\Http\Controllers\Controller;
use App\Models\Balance;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymeController extends Controller
{
    private $transaction;
    private $user;

    public function __construct(Transaction $transaction, User $user)
    {
        $this->transaction = $transaction;
        $this->user = $user;
    }

    public function payme(Request $request)
    {
        $basic = (string) $request->header('Authorization');
        $key = config('services.payme.key');
        $expected = 'Basic ' . base64_encode('Paycom:' . $key);

        if (!$key || !hash_equals($expected, $basic)) {
            return response()->json($this->error(-32504, 'Ошибка авторизации'));
        }

        if (!isset($request['method'])) {
            return response()->json($this->error(-32504, 'Не правильные параметры'));
        }

        switch ($request['method']) {
            case 'CheckPerformTransaction':
                $response = $this->CheckPerformTransaction($request);
                break;
            case 'CreateTransaction':
                $response = $this->CreateTransaction($request);
                break;
            case 'CheckTransaction':
                $response = $this->CheckTransaction($request);
                break;
            case 'PerformTransaction':
                $response = $this->PerformTransaction($request);
                break;
            case 'CancelTransaction':
                $response = $this->CancelTransaction($request);
                break;
            default:
                $response = $this->error(-32601, 'Метод не найден');
        }

        return response()->json($response);
    }

    private function CheckPerformTransaction($params)
    {
        $user = $this->user->find($params['params']['account']['user_id'] ?? null);

        if (!$user) {
            return $this->error(-31099, 'Пользователь не найден');
        }

        return [
            'jsonrpc' => '2.0',
            'result'  => ['allow' => true],
        ];
    }

    private function CreateTransaction($params)
    {
        $transaction = $this->transaction->where('payment_sys_id', $params['params']['id'])->first();

        if ($transaction) {
            return [
                'jsonrpc' => '2.0',
                'result'  => [
                    'create_time' => Carbon::parse($transaction->created_at)->valueOf(),
                    'transaction' => $transaction->payment_sys_id,
                    'state'       => (int) $transaction->status,
                ],
            ];
        }

        $user = User::find($params['params']['account']['user_id'] ?? null);
        if (!$user) {
            return $this->error(-31099, 'Заказ не найден');
        }

        $trans = $this->transaction->create([
            'user_id'        => $user->id,
            'payment_sys_id' => $params['params']['id'],
            'payment_sys'    => 'Payme',
            'amount'         => $params['params']['amount'],
            'status'         => 1,
        ]);

        return [
            'jsonrpc' => '2.0',
            'result'  => [
                'create_time' => Carbon::parse($trans->created_at)->valueOf(),
                'transaction' => $trans->payment_sys_id,
                'state'       => (int) $trans->status,
            ],
        ];
    }

    private function CheckTransaction($params)
    {
        $transaction = Transaction::where('payment_sys_id', $params['params']['id'])->first();

        if (!$transaction) {
            return $this->error(-31003, 'Транзакция не найдена');
        }

        return [
            'jsonrpc' => '2.0',
            'result'  => [
                'create_time'  => Carbon::parse($transaction->created_at)->valueOf(),
                'perform_time' => $transaction->perform_time ?? 0,
                'cancel_time'  => $transaction->cancel_time ?? 0,
                'transaction'  => $transaction->payment_sys_id,
                'state'        => (int) $transaction->status,
                'reason'       => $transaction->reason ? (int) $transaction->reason : null,
            ],
        ];
    }

    private function PerformTransaction($params)
    {
        return DB::transaction(function () use ($params) {
            $transaction = Transaction::where('payment_sys_id', $params['params']['id'])
                ->lockForUpdate()
                ->first();

            if (!$transaction) {
                return $this->error(-31003, 'Транзакция не найдена');
            }

            // Faqat "kutilmoqda" (status 1) holatida balansni to'ldiramiz.
            // Qayta so'rov kelsa (status allaqachon 2), balans QAYTA qo'shilmaydi — idempotent.
            if ($transaction->status == 1) {
                $user = User::find($transaction->user_id);
                if (!$user) {
                    return $this->error(-31099, 'Пользователь не найден');
                }

                $transaction->update([
                    'status'       => 2,
                    'perform_time' => Carbon::now()->valueOf(),
                ]);

                $user->credit($transaction->amount);
                Balance::message($user->id, $this->creditMessage($transaction->amount, $user));
            }

            return [
                'jsonrpc' => '2.0',
                'result'  => [
                    'transaction'  => $transaction->payment_sys_id,
                    'perform_time' => (int) $transaction->perform_time,
                    'state'        => (int) $transaction->status,
                ],
            ];
        });
    }

    private function CancelTransaction($params)
    {
        return DB::transaction(function () use ($params) {
            $transaction = Transaction::where('payment_sys_id', $params['params']['id'])
                ->lockForUpdate()
                ->first();

            if (!$transaction) {
                return $this->error(-31003, 'Транзакция не найдена');
            }

            $cancelTime = Carbon::now()->valueOf();

            if ($transaction->status == 1) {
                $transaction->update([
                    'status'      => -1,
                    'cancel_time' => $cancelTime,
                    'reason'      => $params['params']['reason'] ?? null,
                ]);
            } elseif ($transaction->status == 2) {
                // Pul allaqachon balansga qo'shilgan — bekor qilinganda qaytarib olamiz.
                $user = User::find($transaction->user_id);
                if ($user) {
                    $user->debit($transaction->amount);
                }
                $transaction->update([
                    'status'      => -2,
                    'cancel_time' => $cancelTime,
                    'reason'      => $params['params']['reason'] ?? null,
                ]);
            }

            return [
                'jsonrpc' => '2.0',
                'result'  => [
                    'transaction' => $transaction->payment_sys_id,
                    'cancel_time' => (int) $transaction->cancel_time,
                    'state'       => (int) $transaction->status,
                ],
            ];
        });
    }

    private function error(int $code, string $message): array
    {
        return [
            'jsonrpc' => '2.0',
            'error'   => [
                'code'    => $code,
                'message' => ['ru' => $message, 'uz' => $message, 'en' => $message],
            ],
        ];
    }

    private function creditMessage($amount, $user): string
    {
        return 'Balansingiz ' . substr_replace($amount, '.', -2, 0)
            . " so'mga to'ldirildi. Hozirda balansingiz "
            . substr_replace($user->balance, '.', -2, 0) . " so'm.";
    }
}
