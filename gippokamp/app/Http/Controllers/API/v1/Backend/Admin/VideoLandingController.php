<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Http\Requests\VideoLandingRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\VideoLandingResource;
use App\Models\VideoLanding;
use Illuminate\Http\Request;

class VideoLandingController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $videos = VideoLanding::orderBy('id', 'desc')
            ->paginate($request->get('perPage') ?? 12);
        return VideoLandingResource::collection($videos);
    }

    public function show(int $id)
    {
        try {
            $video = VideoLanding::findOrFail($id);
            return $this->successResponse('success', VideoLandingResource::make($video));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(VideoLandingRequest $request, $id)
    {
        try {
            $request = $request->validated();
            $video = VideoLanding::findOrFail($id);
            if ($request['video']){
                $request['video'] = $this->delete(null, null, null, $video->video);
            }
            $video->update($request);
            return $this->successResponse('success', VideoLandingResource::make($video));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }
}
