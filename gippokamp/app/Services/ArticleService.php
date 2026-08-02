<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\Article;
use App\Models\CategoryHasArticle;
use Illuminate\Support\Str;

class ArticleService extends BaseService
{
    public function store($request)
    {
        try {
            $article = Article::create($request);
            $article->categories()->attach($request['category_ids_with_sort']);
            if (!empty($request['blocks'])){
                (new QuestionBlockService())->store($article->id, $request['blocks'], 'article');
            }
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $article];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($request, $id)
    {
        try {
            $article = Article::findOrFail($id);
            $article->update($request);
            $article->categories()->sync($request['category_ids_with_sort']);

            $article->blocks->each(function($block) {
                $block->questions()->detach();
            });
            $article->blocks()->delete();

            if (!empty($request['blocks'])){
                (new QuestionBlockService())->store($article->id, $request['blocks'], 'article');
            }
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $article];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function destroy(int $id)
    {
        try {
            $article = Article::findOrFail($id);
            $article->categories()->detach();
            $article->chapters()->detach();
            $article->delete();
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

    public function has_chapters_destroy($request, $id)
    {
        try {
            $article = Article::findOrFail($id);
            $article->chapters()->detach($request['ids']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

}
