<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\Article;
use App\Models\CategoryHasArticle;
use App\Models\Chapter;

class ChapterService extends BaseService
{
    public function store($request)
    {
        try {
            $chapter = Chapter::create($request);
            $chapter->articles()->attach($request['article_ids_with_sort']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $chapter];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($request, $id)
    {
        try {
            $chapter = Chapter::findOrFail($id);
            $chapter->update($request);
            $chapter->articles()->sync($request['article_ids_with_sort']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $chapter];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function destroy(int $id)
    {
        try {
            $chapter = Chapter::findOrFail($id);
            $chapter->articles()->detach();
            $chapter->delete();
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
