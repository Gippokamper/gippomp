<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\Article;
use App\Models\Quiz;
use App\Models\StudyPlan;
use App\Models\Video;
use Dflydev\DotAccessData\Data;
use Illuminate\Support\Str;

class QuizService extends BaseService
{
    public function store($request)
    {
        try {
            $quiz = Quiz::create($request);
            $quiz->parentQuiz()->attach($request['quiz_ids_with_sort']);
            if (!empty($request['blocks'])){
                $result = (new QuestionBlockService())->store($quiz->id, $request['blocks'], 'quiz');
                if ($result['status']){
                    return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $quiz];
                }
                return ['status' => false, 'code' => 400, 'message' => $result['message'], 'httpCode' => 400];
            }
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $quiz];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($request, $id)
    {
        try {
            $quiz = Quiz::findOrFail($id);
            $quiz->update($request);
            $quiz->parentQuiz()->sync($request['quiz_ids_with_sort']);
            if (!empty($request['blocks'])){
                $quiz->blocks->each(function($block) {
                    $block->questions()->detach();
                });
                $quiz->blocks()->delete();
                $result = (new QuestionBlockService())->store($quiz->id, $request['blocks'], 'quiz');
                if ($result['status']){
                    return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $quiz];
                }
                return ['status' => false, 'code' => 400, 'message' => $result['message'], 'httpCode' => 400];
            }
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $quiz];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
    public function destroy(int $id)
    {
        try {
            $quiz = Quiz::findOrFail($id);
            $quiz->parentQuiz()->detach();
            $quiz->childQuiz()->detach();
            // Bloklarni o'chirishdan oldin ular bilan bog'liq savol pivotlarini tozalaymiz.
            foreach ($quiz->blocks as $block) {
                $block->questions()->detach();
            }
            $quiz->blocks()->delete();
            $quiz->delete();
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
