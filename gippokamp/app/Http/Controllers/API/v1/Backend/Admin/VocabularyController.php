<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;


use App\Enums\ResponseError;
use App\Http\Requests\CategoryRequests\CategoryRequest;
use App\Http\Requests\CategoryRequests\CategoryDeleteRequest;
use App\Http\Requests\VocabularyRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\VocabularyResource;
use App\Models\Category;
use App\Models\Vocabulary;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class VocabularyController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $vocabulary = Vocabulary::when($request->get('search'), function ($q) use ($request) {
                    $q->where(function ($query) use ($request) {
                        $query->orWhereRaw("JSON_SEARCH(translation, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                    });
                })
                ->orderBy('id')
                ->paginate($request->get('perPage') ?? 12);
        return VocabularyResource::collection($vocabulary);
    }

    public function store(VocabularyRequest $request)
    {
        try {
            Vocabulary::create($request->validated());
            return $this->successResponse('success');
        }catch (\Exception $e){
            return $this->errorResponse(500, ResponseError::ERROR_500->value, 500);
        }
    }

    public function show(int $id)
    {
        try {
            $vocabulary = Vocabulary::findOrFail($id);
            return $this->successResponse('success', VocabularyResource::make($vocabulary));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(VocabularyRequest $request, $id)
    {
        try {
            Vocabulary::findOrFail($id)->update($request->validated());
            return $this->successResponse('success');
        }catch (\Exception $e){
            return $this->errorResponse(404, ResponseError::ERROR_404->value, 404);
        }
    }

    public function destroy(int $id)
    {
        try {
            Vocabulary::findOrFail($id)->delete();
            return $this->successResponse('success');
        }catch (\Exception $e){
            return $this->errorResponse(404, ResponseError::ERROR_404->value, 404);
        }
    }

    public function bulk_destroy(Request $request)
    {
        try {
            foreach ($request['ids'] as $id){
                $this->destroy($id);
            }
            return $this->successResponse('success');
        }catch (\Exception $e){
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }
}
