<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

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

class ChapterController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $categories = Chapter::when($request->get('search'), function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->orWhereRaw("JSON_SEARCH(title, 'one', ?) IS NOT NULL", ['%' . $request->search . '%'])
                        ->orWhereRaw("JSON_SEARCH(description, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                });
            })
            ->orderBy('id', 'desc')
            ->paginate($request->get('perPage') ?? 12);

        return ChapterResource::collection($categories);
    }

    public function store(ChapterRequest $request)
    {
        $result = (new ChapterService())->store($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), ChapterResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function show(int $id)
    {
        try {
            $category = Chapter::with(['articles'])->findOrFail($id);
            return $this->successResponse('success', ChapterResource::make($category));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(ChapterRequest $request, $id)
    {
        $result = (new ChapterService())->update($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']), ChapterResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function destroy(int $id)
    {
        $result = (new ChapterService())->destroy($id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function bulk_destroy(ChapterDeleteRequest $request)
    {
        $result = (new ChapterService())->bulk_destroy($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
