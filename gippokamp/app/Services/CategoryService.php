<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\Category;
use App\Models\CategoryHasCategory;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class CategoryService extends BaseService
{
    public function store($request)
    {
        try {
            $category = Category::create($request);
            $category->parentCategory()->attach($request['category_ids_with_sort']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $category];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($request, $id)
    {
        try {
            $category = Category::findOrFail($id);
            $category->update($request);
            $category->parentCategory()->sync($request['category_ids_with_sort']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $category];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function destroy(int $id)
    {
        try {
            $category = Category::findOrFail($id);
            $category->parentCategory()->detach();
            $category->childCategory()->detach();
            $category->delete();
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

    public function has_categories_destroy($request, $id)
    {
        try {
            $category = Category::findOrFail($id);
            $category->childCategory()->detach($request['ids']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function has_articles_destroy($request, $id)
    {
        try {
            $category = Category::findOrFail($id);
            $category->articles()->detach($request['ids']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
}
