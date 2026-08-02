<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;


use App\Enums\ResponseError;
use App\Http\Requests\VideoRequests\VideoDeleteRequest;
use App\Http\Requests\VideoRequests\VideoRequest;
use App\Http\Resources\VideoResource;
use App\Models\Video;
use App\Services\VideoService;
use Illuminate\Http\Request;

class VideoController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $videos = Video::with(['categories'])
            ->when($request->get('search'), function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->orWhereRaw("JSON_SEARCH(name, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                });
            })
            ->orderBy('id', 'desc')
            ->paginate($request->get('perPage'));
        return VideoResource::collection($videos);
    }

    public function store(VideoRequest $request)
    {
        $result = (new VideoService())->store($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), VideoResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function show(int $id)
    {
        try {
            $video = Video::with(['categories'])->findOrFail($id);
            return $this->successResponse('success', VideoResource::make($video));
        }catch (\Exception $e){
            return $this->errorResponse(404, __(ResponseError::ERROR_404->value), 404);
        }
    }

    public function update(VideoRequest $request, $id)
    {
        $result = (new VideoService())->update($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']), VideoResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function destroy(int $id)
    {
        $result = (new VideoService())->destroy($id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function bulk_destroy(VideoDeleteRequest $request)
    {
        $result = (new VideoService())->bulk_destroy($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
