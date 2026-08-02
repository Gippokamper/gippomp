<?php

namespace App\Http\Controllers\API\v1\Backend\User;


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

class StudyPlanController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
//        if($request->get('without_child')){
            $plans = StudyPlan::with('childPlan.childPlan')
                ->whereDoesntHave('parentPlan')
                ->paginate($request->get('perPage') ?? 12);
            return StudyPlanResource::collection($plans);
//        }
//        elseif($request->get('with_content')){
//            $plans = StudyPlan::with(['articles', 'blocks'])
//                ->whereHas('articles')
//                ->whereHas('blocks')
//                ->paginate($request->get('perPage') ?? 12);
//        }else{
//            $plans = StudyPlan::orderBy('id')->paginate($request->get('perPage') ?? 12);
//        }
//        return StudyPlanResource::collection($plans);
    }

    public function show(string $slug)
    {
        try {
            $plan = StudyPlan::with(['childPlan.childPlan', 'childPlan.articles', 'childPlan.blocks.questions', 'articles', 'blocks.questions'])->firstWhere('slug', $slug);
            return $this->successResponse('success', StudyPlanResource::make($plan));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }
}
