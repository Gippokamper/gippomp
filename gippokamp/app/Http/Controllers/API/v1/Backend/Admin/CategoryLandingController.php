<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Http\Requests\CategoryLandingRequest;
use App\Http\Resources\CategoryLandingResource;
use App\Models\CategoryLanding;
use App\Traits\MediaTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryLandingController extends AdminBaseController
{
    use MediaTrait;
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $categories = CategoryLanding::orderBy('id', 'desc')
            ->paginate($request->get('perPage') ?? 12);
        return CategoryLandingResource::collection($categories);
    }

    public function store(CategoryLandingRequest $request)
    {
        try {
            $request = $request->validated();
            $category = CategoryLanding::create($request);
            return $this->successResponse('success', CategoryLandingResource::make($category));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function show(int $id)
    {
        try {
            $category = CategoryLanding::with(['parentCategory', 'childCategory'])->findOrFail($id);
            return $this->successResponse('success', CategoryLandingResource::make($category));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(CategoryLandingRequest $request, $id)
    {
        try {
            $request = $request->validated();
            $category = CategoryLanding::findOrFail($id);
            if ($request['photo']){
                $request['photo'] = $this->delete(null, null, null, $category->photo);
            }
            $category->update($request);
            return $this->successResponse('success', CategoryLandingResource::make($category));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function destroy($id)
    {
        try {
            $category = CategoryLanding::with(['childCategory'])->findOrFail($id);
            $this->delete(null, null, null, $category->photo);

            if ($category->childCategory->count() > 0) {
                foreach ($category->childCategory as $childCategory) {
                    $this->destroy($childCategory->id);
                }
            }
            $category->delete();
            return $this->successResponse('success', []);
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function bulk_destroy(Request $request)
    {
        try {
            DB::beginTransaction();

            foreach ($request->get('ids') as $id) {
                $this->destroy($id);
            }

            DB::commit();
            return $this->successResponse('success', [], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }
}
