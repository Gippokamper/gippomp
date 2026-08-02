<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleRequests\ArticleDeleteRequest;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Services\ArticleService;
use Illuminate\Http\Request;

class ArticleController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $categories = Article::with(['categories'])
            ->when($request->get('search'), function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                     $query->orWhereRaw("JSON_SEARCH(name, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                });
            })
            ->orderBy('id', 'desc')
            ->paginate($request->get('perPage') ?? 12);
        return ArticleResource::collection($categories);
    }

    public function store(ArticleRequest $request)
    {
        $result = (new ArticleService())->store($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), ArticleResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function show(int $id)
    {
        try {
            $article = Article::with(['categories', 'chapters', 'blocks.questions'])->findOrFail($id);
            return $this->successResponse('success', ArticleResource::make($article));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(ArticleRequest $request, $id)
    {
        $result = (new ArticleService())->update($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']), ArticleResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function destroy(int $id)
    {
        $result = (new ArticleService())->destroy($id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function bulk_destroy(ArticleDeleteRequest $request)
    {
        $result = (new ArticleService())->bulk_destroy($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function has_chapters_destroy(ArticleDeleteRequest $request, $id)
    {
        $result = (new ArticleService())->has_chapters_destroy($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
