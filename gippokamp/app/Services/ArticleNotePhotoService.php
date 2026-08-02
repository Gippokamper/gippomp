<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\ArticleInfo;
use App\Models\ArticleNotePhoto;

class ArticleNotePhotoService extends BaseService
{
    public function store($request)
    {
        try {
             $article_note_photo = ArticleNotePhoto::create($request);
             return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $article_note_photo];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($request, $id)
    {
        try {
            $article_note_photo = ArticleNotePhoto::findOrFail($id);
            $article_note_photo->update($request);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $article_note_photo];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function destroy(int $id)
    {
        try {
            $article = ArticleNotePhoto::findOrFail($id);
            $this->delete(null, null, null, $article->photo);
            $this->delete(null, null, null, $article->marker_photo);
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
