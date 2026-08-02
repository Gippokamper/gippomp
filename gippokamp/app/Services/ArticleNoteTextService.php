<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\ArticleInfo;
use App\Models\ArticleNoteText;

class ArticleNoteTextService extends BaseService
{
    public function store($request)
    {
        try {
            $article = ArticleNoteText::create($request);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $article];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($request, $id)
    {
        try {
            $article = ArticleNoteText::findOrFail($id);
            $article->update($request);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $article];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
    public function destroy(int $id)
    {
        try {
            $article = ArticleNoteText::findOrFail($id);
            $article->delete($article);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
    public function bulk_destroy($request)
    {
        try {
            foreach ($request['ids'] as $id){
                $this->destroy($id);
            }
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
}
