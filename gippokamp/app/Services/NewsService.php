<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\Article;
use App\Models\CategoryHasArticle;
use App\Models\News;
use Illuminate\Support\Str;

class NewsService extends BaseService
{
    public function store($request)
    {
        try {
            $news = News::create($request);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $news];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($request, $id)
    {
        try {
            $news = News::findOrFail($id);
            $news->update($request);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $news];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function destroy(int $id)
    {
        try {
            $news = News::findOrFail($id);
            $this->delete(null, null, null, $news->photo);
            $news->delete();
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
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
