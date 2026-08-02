<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Requests\ChapterRequests\ChapterRequest;
use App\Http\Requests\ChapterRequests\ChapterDeleteRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ChapterResource;
use App\Models\Article;
use App\Models\Chapter;
use App\Services\ArticleService;
use App\Services\ChapterService;
use Illuminate\Http\Request;

class ChapterController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $chapters = Chapter::orderBy('id')->paginate($request->get('perPage') ?? 12);
        return ChapterResource::collection($chapters);
    }

    public function show(int $id)
    {
        try {
            $chapter = Chapter::findOrFail($id);
            return $this->successResponse('success', ChapterResource::make($chapter));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }
}
