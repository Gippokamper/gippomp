<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\Article;
use App\Models\VideoCategory;
use Illuminate\Support\Str;

class VideoCategoryService extends BaseService
{
    public function store($request)
    {
        try {
            $video_category = VideoCategory::create($request);
            if (!empty($request['category_ids_with_sort'])){
                $video_category->parentCategory()->attach($request['category_ids_with_sort']);
            }
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $video_category];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($request, $id)
    {
        try {
            $video_category = VideoCategory::findOrFail($id);
            $request['slug'] = Str::slug($request['name']['uz']);
            $video_category->parentCategory()->sync($request['category_ids_with_sort']);
            $video_category->update($request);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $video_category];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function destroy(int $id)
    {
        try {
            $article = VideoCategory::findOrFail($id);
            $article->parentCategory()->detach();
            $article->childCategory()->detach();
            $article->videos()->detach();
            $article->delete();
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function bulk_destroy($request)
    {
        try {
            foreach ($request['ids'] as $id) {
                $this->destroy($id);
            }
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        }catch (\Exception $e){
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function has_video_categories_destroy($request, $id)
    {
        try {
            $category = VideoCategory::findOrFail($id);
            $category->childCategory()->detach($request['ids']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function has_videos_destroy($request, $id)
    {
        try {
            $category = VideoCategory::findOrFail($id);
            $category->videos()->detach($request['ids']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
}
