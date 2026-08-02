<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Http\Requests\PartnerRequest;
use App\Http\Resources\PartnerResource;
use App\Models\Partner;
use App\Traits\MediaTrait;
use Illuminate\Http\Request;

class PartnerController extends AdminBaseController
{
    use MediaTrait;
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $partners = Partner::orderBy('id', 'desc')
            ->paginate($request->get('perPage') ?? 12);
        return PartnerResource::collection($partners);
    }

    public function store(PartnerRequest $request)
    {
        try {
            $request = $request->validated();
            $partner = Partner::create($request);
            return $this->successResponse('success', PartnerResource::make($partner));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function show(int $id)
    {
        try {
            $partner = Partner::findOrFail($id);
            return $this->successResponse('success', PartnerResource::make($partner));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(PartnerRequest $request, $id)
    {
        try {
            $partner = Partner::findOrFail($id);
            if ($request['photo']){
                $request['photo'] = $this->delete(null, null, null, $partner->photo);
            }
            $partner->update($request->validated());
            return $this->successResponse('success', PartnerResource::make($partner));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function destroy($id)
    {
        try {
            $partner = Partner::findOrFail($id);
            $this->delete(null, null, null, $partner->photo);
            $partner->delete();
            return $this->successResponse('success',[]);
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function bulk_destroy(Request $request)
    {
        try {
            foreach ($request->get('ids') as $id)
            {
                $this->destroy($id);
            }
            return $this->successResponse('success',[]);
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }

    }
}
