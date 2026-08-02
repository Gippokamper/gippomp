<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Controllers\API\v1\Backend\User\UserBaseController;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\RegionResource;
use App\Models\Article;
use App\Models\Region;
use App\Services\ArticleService;
use Illuminate\Http\Request;

class RegionController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        $regions = Region::orderBy('id')->get();
        return RegionResource::collection($regions);
    }
}
