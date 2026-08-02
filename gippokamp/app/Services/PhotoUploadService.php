<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\Category;
use App\Models\CategoryHasCategory;
use Symfony\Component\HttpFoundation\Response;

class PhotoUploadService extends BaseService
{
    public function upload($request)
    {
        try {
           $path = $this->photo($request['image'],  $request['folder']);
           return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => ['path' => $path]];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
}
