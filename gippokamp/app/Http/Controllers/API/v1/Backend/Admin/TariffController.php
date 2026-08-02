<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Http\Requests\TariffRequests\TariffDeleteRequest;
use App\Http\Requests\TariffRequests\TariffRequest;
use App\Http\Resources\TariffResource;
use App\Http\Resources\TermResource;
use App\Models\Tariff;
use App\Models\TariffTerm;
use App\Services\TariffService;
use Illuminate\Http\Request;

class TariffController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function terms(Request $request)
    {
        $terms = TariffTerm::orderBy('id')->get();
        return TermResource::collection($terms);
    }

    public function index(Request $request)
    {
        $tariffs = Tariff::with('term')
            ->when($request->get('search'), function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->orWhereRaw("JSON_SEARCH(name, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                });
            })
            ->orderBy('id')
            ->paginate($request->get('perPage') ?? 12);
        return TariffResource::collection($tariffs);
    }

    public function store(TariffRequest $request)
    {
        $result = (new TariffService())->store($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), TariffResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function show(int $id)
    {
        try {
            $tariff = Tariff::with(['term'])->findOrFail($id);
            return $this->successResponse('success', TariffResource::make($tariff));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(TariffRequest $request, $id)
    {
        $result = (new TariffService())->update($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']), TariffResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function destroy(int $id)
    {
        $result = (new TariffService())->destroy($id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function bulk_destroy(TariffDeleteRequest $request)
    {
        $result = (new TariffService())->bulk_destroy($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
