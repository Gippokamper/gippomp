<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;


use App\Enums\ResponseError;
use App\Http\Requests\CategoryRequests\CategoryRequest;
use App\Http\Requests\CategoryRequests\CategoryDeleteRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $categories = Category::with(['parentCategory'])
            ->when($request->get('search'), function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->orWhereRaw("JSON_SEARCH(name, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                });
            })
            ->orderBy('sort')
            ->paginate($request->get('perPage') ?? 12);
        return CategoryResource::collection($categories);
    }

    public function store(CategoryRequest $request)
    {
        $result = (new CategoryService())->store($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), CategoryResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function show(int $id)
    {
        try {
            $category = Category::with(['parentCategory', 'childCategory', 'articles'])->findOrFail($id);
            return $this->successResponse('success', CategoryResource::make($category));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(CategoryRequest $request, $id)
    {
        $result = (new CategoryService())->update($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']), CategoryResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function destroy(int $id)
    {
        $result = (new CategoryService())->destroy($id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function bulk_destroy(CategoryDeleteRequest $request)
    {
        $result = (new CategoryService())->bulk_destroy($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function has_categories_destroy(CategoryDeleteRequest $request, $id)
    {
        $result = (new CategoryService())->has_categories_destroy($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function has_articles_destroy(CategoryDeleteRequest $request, $id)
    {
        $result = (new CategoryService())->has_articles_destroy($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
