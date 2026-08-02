<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\Article;
use App\Models\StudyPlan;
use App\Models\Video;
use Dflydev\DotAccessData\Data;
use Illuminate\Support\Str;

class StudyPlanService extends BaseService
{
    public function store($request)
    {
        try {
            $plan = StudyPlan::create($request);
            $plan->parentPlan()->attach($request['plan_ids_with_sort']);
            $plan->articles()->attach($request['article_ids_with_sort']);
            if (!empty($request['blocks'])){
                $result = (new QuestionBlockService())->store($plan->id, $request['blocks'], 'study_plan');
                if ($result['status']){
                    return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $plan];
                }
                return ['status' => false, 'code' => 400, 'message' => $result['message'], 'httpCode' => 400];
            }
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $plan];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($request, $id)
    {
        try {
            $plan = StudyPlan::findOrFail($id);
            $plan->update($request);
            $plan->parentPlan()->sync($request['plan_ids_with_sort']);
            $plan->articles()->sync($request['article_ids_with_sort']);
            if (!empty($request['blocks'])){
                $plan->blocks->each(function($block) {
                    $block->questions()->detach();
                });
                $plan->blocks()->delete();
                $result = (new QuestionBlockService())->store($plan->id, $request['blocks'], 'study_plan');
                if ($result['status']){
                    return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $plan];
                }
                return ['status' => false, 'code' => 400, 'message' => $result['message'], 'httpCode' => 400];
            }
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $plan];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
    public function destroy(int $id)
    {
        try {
            $study_plan = StudyPlan::findOrFail($id);
            $study_plan->parentPlan()->detach();
            $study_plan->childPlan()->detach();
            $study_plan->articles()->detach();
            $study_plan->blocks->each(function($block) {
                $block->questions()->detach();
            });
            $study_plan->blocks()->delete();
            $study_plan->delete();
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
    public function bulk_destroy(array $request)
    {
        foreach ($request['ids'] as $id)
        {
            $this->destroy($id);
        }
        return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
    }
}
