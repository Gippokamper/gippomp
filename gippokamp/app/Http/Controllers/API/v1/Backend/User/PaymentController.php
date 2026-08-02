<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\PaymentResource;
use App\Models\Article;
use App\Models\ArticleRead;
use App\Models\Balance;
use App\Services\ArticleService;
use Illuminate\Http\Request;

class PaymentController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        // desc: eng yangi to'lovlar birinchi sahifada bo'lsin. Ilgari
        // `orderBy('id')` (o'sish tartibida) edi — foydalanuvchi 1-sahifada
        // eng eski, 2024-yilgi yozuvlarni ko'rardi.
        $payments = Balance::where('user_id', auth('sanctum')->user()->id)
            ->orderBy('id', 'desc')
            ->paginate($request->get('perPage') ?? 12);
        return PaymentResource::collection($payments);
    }
}
