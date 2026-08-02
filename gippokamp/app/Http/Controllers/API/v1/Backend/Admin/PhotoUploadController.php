<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;


use App\Enums\ResponseError;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequests\CategoryRequest;
use App\Http\Requests\PhotoUploadRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use App\Services\PhotoUploadService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PhotoUploadController extends Controller
{
    use ApiResponse;
    public function __construct()
    {
        $this->middleware(['sanctum.check', 'verified.check', 'roles:admin|user']);
    }

    public function upload(PhotoUploadRequest $request)
    {
        $result = (new PhotoUploadService())->upload($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), $result['data']);
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
