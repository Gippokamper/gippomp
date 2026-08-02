<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;


use App\Enums\ResponseError;
use App\Http\Requests\StudyPlanRequests\StudyPlanDeleteRequest;
use App\Http\Requests\StudyPlanRequests\StudyPlanRequest;
use App\Http\Requests\VideoRequests\VideoDeleteRequest;
use App\Http\Requests\VideoRequests\VideoRequest;
use App\Http\Resources\StudyPlanResource;
use App\Http\Resources\VideoResource;
use App\Models\StudyPlan;
use App\Models\Video;
use App\Services\StudyPlanService;
use App\Services\VideoService;
use Illuminate\Http\Request;

class StudyPlanController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        if($request->get('without_child')){
            $plans = StudyPlan::with(['parentPlan'])
                ->whereDoesntHave('childPlan')
                ->when($request->get('search'), function ($q) use ($request) {
                    $q->where(function ($query) use ($request) {
                        $query->orWhereRaw("JSON_SEARCH(name, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                    });
                })
                ->paginate($request->get('perPage') ?? 12);
            return StudyPlanResource::collection($plans);
        }
        elseif($request->get('with_content')){
            $plans = StudyPlan::with(['parentPlan', 'articles', 'blocks'])
                ->whereHas('articles')
                ->whereHas('blocks')
                ->paginate($request->get('perPage') ?? 12);
        }elseif($request->get('without_content')){
            $plans = StudyPlan::with(['parentPlan'])
                ->whereDoesntHave('articles')
                ->whereDoesntHave('blocks')
                ->paginate($request->get('perPage') ?? 12);
        }else{
            $plans = StudyPlan::with('parentPlan')
                    ->when($request->get('search'), function ($q) use ($request) {
                        $q->where(function ($query) use ($request) {
                            $query->orWhereRaw("JSON_SEARCH(name, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                        });
                    })
                ->orderBy('id', 'desc')
                ->paginate($request->get('perPage') ?? 12);
        }
        return StudyPlanResource::collection($plans);
    }

    public function store(StudyPlanRequest $request)
    {
        $result = (new StudyPlanService())->store($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), StudyPlanResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function show(int $id)
    {
        try {
            $plan = StudyPlan::with(['parentPlan', 'articles', 'blocks.questions'])->findOrFail($id);
            return $this->successResponse('success', StudyPlanResource::make($plan));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(StudyPlanRequest $request, $id)
    {
        $result = (new StudyPlanService())->update($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']), StudyPlanResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function destroy(int $id)
    {
        $result = (new StudyPlanService())->destroy($id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function bulk_destroy(StudyPlanDeleteRequest $request)
    {
        $result = (new StudyPlanService())->bulk_destroy($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
