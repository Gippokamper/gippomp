<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;


use App\Enums\ResponseError;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequests\CategoryRequest;
use App\Http\Requests\PhotoUploadRequest;
use App\Http\Requests\VideoUploadRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use App\Services\PhotoUploadService;
use App\Services\VideoUploadService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class VideoUploadController extends Controller
{
    use ApiResponse;
    public function __construct()
    {
        $this->middleware(['sanctum.check', 'verified.check', 'roles:admin|user']);
    }

    public function upload(VideoUploadRequest $request)
    {
        $result = (new VideoUploadService())->upload($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), $result['data']);
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
