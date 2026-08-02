<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Controllers\API\v1\Backend\Admin\AdminBaseController;
use App\Http\Requests\ArticleRequests\ArticleDeleteRequest;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Requests\PrivacyPolicyRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\PrivacyPolicyResource;
use App\Models\Article;
use App\Models\PrivacyPolicy;
use App\Services\ArticleService;
use App\Traits\MediaTrait;
use Illuminate\Http\Request;

class PrivacyPolicyController extends UserBaseController
{
    use MediaTrait;
    public function __construct()
    {
        parent::__construct();
    }

    public function show()
    {
        try {
            $policy = PrivacyPolicy::findOrFail(1);
            return $this->successResponse('success', PrivacyPolicyResource::make($policy));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

}
