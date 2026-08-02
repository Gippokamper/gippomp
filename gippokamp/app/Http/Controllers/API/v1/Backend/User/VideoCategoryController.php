<?php

namespace App\Http\Controllers\API\v1\Backend\User;


use App\Enums\ResponseError;
use App\Http\Requests\ArticleNotePhotoRequests\VideoCategoryDeleteRequest;
use App\Http\Requests\VideoCategoryRequests;
use App\Http\Resources\VideoCategoryResource;
use App\Models\VideoCategory;
use App\Services\VideoCategoryService;
use Illuminate\Http\Request;

class VideoCategoryController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $video_categories = VideoCategory::whereDoesntHave('parentCategory')
            ->orderBy('id')
            ->paginate($request->get('perPage') ?? 12);
        return VideoCategoryResource::collection($video_categories);
    }

    public function show(string $slug)
    {
        try {
            $video_category = VideoCategory::with(['parentCategory', 'childCategory', 'videos'])->firstWhere('slug', $slug);
            return $this->successResponse('success', VideoCategoryResource::make($video_category));
        }catch (\Exception $e){
            return $this->errorResponse(404, __(ResponseError::ERROR_404->value), 404);
        }
    }
}
