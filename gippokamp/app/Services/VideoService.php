<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\Article;
use App\Models\Video;
use Illuminate\Support\Str;

class VideoService extends BaseService
{
    public function store($request)
    {
        try {
            $video = Video::create($request);
            $video->categories()->attach($request['category_ids_with_sort']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $video];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($request, $id)
    {
        try {
            $video = Video::findOrFail($id);
            $video->update($request);
            $video->categories()->sync($request['category_ids_with_sort']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $video];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
    public function destroy(int $id)
    {
        try {
            $video = Video::findOrFail($id);
            $video->categories()->detach();
            $video->delete();
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
    public function bulk_destroy(array $request)
    {
        foreach ($request['ids'] as $id)
        {
            $this->destroy($id);
        }
        return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
    }
}
