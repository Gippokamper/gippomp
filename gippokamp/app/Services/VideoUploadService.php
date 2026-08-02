<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\Category;
use App\Models\CategoryHasCategory;
use Symfony\Component\HttpFoundation\Response;

class VideoUploadService extends BaseService
{
    public function upload($request)
    {
        try {
           $path = $this->video($request['video']);
           if (!$path) {
               return ['status' => false, 'code' => 400, 'message' => 'Video not uploaded', 'httpCode' => 400];
           }
           return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => ['path' => $path]];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
}
