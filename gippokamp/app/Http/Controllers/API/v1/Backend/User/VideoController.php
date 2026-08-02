<?php

namespace App\Http\Controllers\API\v1\Backend\User;


use App\Enums\ResponseError;
use App\Http\Requests\VideoRequests\VideoDeleteRequest;
use App\Http\Requests\VideoRequests\VideoRequest;
use App\Http\Resources\VideoResource;
use App\Models\Video;
use App\Services\VideoService;
use Illuminate\Http\Request;

class VideoController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $videos = Video::orderBy('id')->paginate($request->get('perPage'));
        return VideoResource::collection($videos);
    }

    public function show(string $slug)
    {
        try {
            $video = Video::with(['categories'])->firstWhere('slug', $slug);
            return $this->successResponse('success', VideoResource::make($video));
        }catch (\Exception $e){
            return $this->errorResponse(404, __(ResponseError::ERROR_404->value), 404);
        }
    }
}
