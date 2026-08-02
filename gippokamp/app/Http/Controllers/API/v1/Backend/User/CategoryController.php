<?php

namespace App\Http\Controllers\API\v1\Backend\User;


use App\Enums\ResponseError;
use App\Http\Requests\CategoryRequests\CategoryRequest;
use App\Http\Requests\CategoryRequests\CategoryDeleteRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $categories = Category::whereDoesntHave('parentCategory')
            ->orderBy('sort')
            ->paginate($request->get('perPage') ?? 12);
        return CategoryResource::collection($categories);
    }

    public function show(string $slug)
    {
        try {
            $category = Category::with(['parentCategory', 'childCategory', 'articles'])->firstWhere('slug', $slug);
            return $this->successResponse('success', CategoryResource::make($category));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }
}
