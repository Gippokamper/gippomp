<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Enums\ResponseError;
use App\Http\Requests\NewsRequests\NewsDeleteRequest;
use App\Http\Requests\NewsRequests\NewsRequest;
use App\Http\Resources\NewsResource;
use App\Models\News;
use App\Services\NewsService;
use Illuminate\Http\Request;

class NewsController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $news = News::when($request->get('search'), function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->orWhereRaw("JSON_SEARCH(title, 'one', ?) IS NOT NULL", ['%' . $request->search . '%'])
                        ->orWhereRaw("JSON_SEARCH(description, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                });
            })
            ->orderBy('id', 'desc')
            ->paginate($request->get('perPage') ?? 12);
        return NewsResource::collection($news);
    }

    public function store(NewsRequest $request)
    {
        $result = (new NewsService())->store($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), NewsResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function show(int $id)
    {
        try {
            $category = News::findOrFail($id);
            return $this->successResponse('success', NewsResource::make($category));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(NewsRequest $request, $id)
    {
        $result = (new NewsService())->update($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']), NewsResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function destroy(int $id)
    {
        $result = (new NewsService())->destroy($id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function bulk_destroy(NewsDeleteRequest $request)
    {
        $result = (new NewsService())->bulk_destroy($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
