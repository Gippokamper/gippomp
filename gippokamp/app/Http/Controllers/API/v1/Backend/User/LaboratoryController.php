<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Requests\LaboratoryRequests\LaboratoryDeleteRequest;
use App\Http\Requests\LaboratoryRequests\LaboratoryRequest;
use App\Http\Requests\LaboratoryRequests\NewsDeleteRequest;
use App\Http\Requests\LaboratoryRequests\NewsRequest;
use App\Http\Resources\LaboratoryResource;
use App\Models\Laboratory;
use App\Services\LaboratoryService;
use Illuminate\Http\Request;

class LaboratoryController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $laboratories = Laboratory::orderBy('id')->paginate($request->get('perPage') ?? 12);
        return LaboratoryResource::collection($laboratories);
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
}
