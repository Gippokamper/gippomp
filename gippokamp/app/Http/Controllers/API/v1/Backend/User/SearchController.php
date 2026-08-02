<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ChapterResource;
use App\Models\Article;
use App\Models\ArticleRead;
use App\Models\Chapter;
use App\Services\ArticleService;
use Illuminate\Http\Request;

class SearchController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function search()
    {
        $query = request()->search;
        $articleResults = Article::where('name', 'LIKE', '%' . $query . '%')->get();

        // Поиск в chapters
        $chapterResults = Chapter::with(['articles'])
            ->where('title', 'LIKE', '%' . $query . '%')
            ->orWhere('description', 'LIKE', '%' . $query . '%')
            ->get();

        return $this->successResponse('success', [
            'articles' => ArticleResource::collection($articleResults),
            'chapters' => ChapterResource::collection($chapterResults),
        ]);
    }
}
