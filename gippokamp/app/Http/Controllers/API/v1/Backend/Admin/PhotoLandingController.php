<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleRequests\ArticleDeleteRequest;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Requests\PhotoLandingRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\PhotoLandingResource;
use App\Models\Article;
use App\Models\PhotoLanding;
use App\Services\ArticleService;
use App\Traits\MediaTrait;
use Illuminate\Http\Request;

class PhotoLandingController extends AdminBaseController
{
    use MediaTrait;
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $photos = PhotoLanding::orderBy('id', 'desc')
            ->paginate($request->get('perPage') ?? 12);
        return PhotoLandingResource::collection($photos);
    }

    public function show(int $id)
    {
        try {
            $photo = PhotoLanding::findOrFail($id);
            return $this->successResponse('success', PhotoLandingResource::make($photo));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(PhotoLandingRequest $request, $id)
    {
        try {
            $request = $request->validated();
            $photo = PhotoLanding::findOrFail($id);
            if ($request['photo']){
                $request['photo'] = $this->delete(null, null, null, $photo->photo);
            }
            $photo->update($request);
            return $this->successResponse('success', PhotoLandingResource::make($photo));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }
}
