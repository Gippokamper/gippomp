<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Enums\ResponseError;
use App\Http\Requests\LaboratoryRequests\LaboratoryDeleteRequest;
use App\Http\Requests\LaboratoryRequests\LaboratoryRequest;
use App\Http\Requests\LaboratoryRequests\NewsDeleteRequest;
use App\Http\Requests\LaboratoryRequests\NewsRequest;
use App\Http\Resources\LaboratoryResource;
use App\Models\Laboratory;
use App\Services\LaboratoryService;
use Illuminate\Http\Request;

class LaboratoryController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $categories = Laboratory::when($request->get('search'), function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->orWhereRaw("JSON_SEARCH(name, 'one', ?) IS NOT NULL", ['%' . $request->search . '%'])
                        ->orWhereRaw("JSON_SEARCH(description, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                });
            })
            ->orderBy('id')
            ->paginate($request->get('perPage') ?? 12);
        return LaboratoryResource::collection($categories);
    }

    public function store(LaboratoryRequest $request)
    {
        try {
            $laboratory = Laboratory::create($request->validated());
            return $this->successResponse('success', LaboratoryResource::make($laboratory));
        }catch (\Exception $e){
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }

    public function show(int $id)
    {
        try {
            $laboratory = Laboratory::findOrFail($id);
            return $this->successResponse('success', LaboratoryResource::make($laboratory));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(LaboratoryRequest $request, $id)
    {
        try {
            $laboratory = Laboratory::findOrFail($id);
            $laboratory->update($request->validated());
            return $this->successResponse('success', LaboratoryResource::make($laboratory));
        }catch (\Exception $e){
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $laboratory = Laboratory::findOrFail($id);
            $laboratory->delete();
            return $this->successResponse('success');
        }catch (\Exception $e){
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }

    public function bulk_destroy(LaboratoryDeleteRequest $request)
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
