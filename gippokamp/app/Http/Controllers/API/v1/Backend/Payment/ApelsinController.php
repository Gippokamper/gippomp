<?php

namespace App\Http\Controllers\API\v1\Backend\Payment;

use App\Http\Controllers\Controller;
use App\Models\Balance;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApelsinController extends Controller
{
    private $transaction;
    private $user;

    public function __construct(Transaction $transaction, User $user)
    {
        $this->transaction = $transaction;
        $this->user = $user;
    }

    public function check(Request $request)
    {
        \Log::info('PAYMENT', $request->all());

        if (!$this->validToken($request)) {
            return response()->json(['status' => 4, 'message' => "Неверный токен"]);
        }

        $user = $this->user->find($request->personalAccount);
        if (!$user) {
            return response()->json(['status' => 1, 'message' => 'Пользователь не найден']);
        }

        return response()->json([
            'status'   => 0,
            'message'  => "Пользователь успешно найден",
            'balance'  => (int) $user->balance,
            'fullname' => trim($user->firstname . ' ' . $user->lastname),
        ]);
    }

    public function pay(Request $request)
    {
        if (!$this->validToken($request)) {
            return response()->json(['status' => 4, 'message' => "Неверный токен"]);
        }

        $user = $this->user->find($request->personalAccount);
        if (!$user) {
            return response()->json(['status' => 1, 'message' => 'Пользователь не найден']);
        }

        $existing = $this->transaction->where('payment_sys_id', $request->TransactionId)->first();
        if ($existing) {
            return response()->json(['status' => 10, 'message' => "Транзация уже существует"]);
        }

        $transaction = DB::transaction(function () use ($request, $user) {
            $transaction = $this->transaction->create([
                'user_id'        => $request->personalAccount,
                'payment_sys_id' => $request->TransactionId,
                'payment_sys'    => 'Apelsin',
                'amount'         => $request->PaymentAmount,
                'status'         => 2,
            ]);

            $user->credit($transaction->amount);
            $message = 'Balansingiz ' . substr_replace($transaction->amount, '.', -2, 0) .
                ' so\'mga to\'ldirildi. Hozirda balansingiz ' . substr_replace($user->balance, '.', -2, 0) . ' so\'m.';
            Balance::message($user->id, $message);

            return $transaction;
        });

        if ($transaction) {
            return response()->json(['status' => 0, 'message' => "Успешно"]);
        }

        return response()->json(['status' => 15, 'message' => "Неправильные параметры"]);
    }

    private function validToken(Request $request): bool
    {
        $token = $request->header('token');
        $token = is_array($token) ? ($token[0] ?? '') : (string) $token;

        return hash_equals((string) config('services.apelsin.key'), $token);
    }
}
