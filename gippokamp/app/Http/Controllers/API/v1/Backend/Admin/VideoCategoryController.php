<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;


use App\Enums\ResponseError;
use App\Http\Requests\ArticleNotePhotoRequests\VideoCategoryDeleteRequest;
use App\Http\Requests\VideoCategoryRequests;
use App\Http\Resources\VideoCategoryResource;
use App\Models\VideoCategory;
use App\Services\VideoCategoryService;
use Illuminate\Http\Request;

class VideoCategoryController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $video_categories = VideoCategory::with(['parentCategory'])
            ->when($request->get('search'), function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->orWhereRaw("JSON_SEARCH(name, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                });
            })
            ->orderBy('id', 'desc')
            ->paginate($request->get('perPage') ?? 12);
        return VideoCategoryResource::collection($video_categories);
    }

    public function store(VideoCategoryRequests\VideoCategoryRequest $request)
    {
        $result = (new VideoCategoryService())->store($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), VideoCategoryResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function show(int $id)
    {
        try {
            $video_category = VideoCategory::with(['parentCategory', 'childCategory', 'videos'])->findOrFail($id);
            return $this->successResponse('success', VideoCategoryResource::make($video_category));
        }catch (\Exception $e){
            return $this->errorResponse(404, __(ResponseError::ERROR_404->value), 404);
        }
    }

    public function update(VideoCategoryRequests\VideoCategoryRequest $request, $id)
    {
        $result = (new VideoCategoryService())->update($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']), VideoCategoryResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function destroy(int $id)
    {
        $result = (new VideoCategoryService())->destroy($id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function bulk_destroy(VideoCategoryRequests\VideoCategoryDeleteRequest $request)
    {
        $result = (new VideoCategoryService())->bulk_destroy($request);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function has_video_categories_destroy(VideoCategoryRequests\VideoCategoryDeleteRequest $request, $id)
    {
        $result = (new VideoCategoryService())->has_video_categories_destroy($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function has_videos_destroy(VideoCategoryRequests\VideoCategoryDeleteRequest $request, $id)
    {
        $result = (new VideoCategoryService())->has_videos_destroy($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
