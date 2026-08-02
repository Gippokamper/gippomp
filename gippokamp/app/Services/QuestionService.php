<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\Article;
use App\Models\Question;
use Illuminate\Support\Str;

class QuestionService extends BaseService
{
    public function store($request)
    {
        try {
            $question = Question::create($request);
            $question->folders()->attach($request['folder_ids']);
            $result = (new AnswerService())->store($request['answers'], $question->id);
            if (!$result['status']){
                return ['status' => false, 'code' => $result['code'], 'message' => $result['message'], 'httpCode' => $result['code']];
            }
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $question];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($request, $id)
    {
        try {
            $question = Question::findOrFail($id);
            $question->update($request);
            $question->folders()->sync($request['folder_ids']);
            $result = (new AnswerService())->update($request['answers'], $question->id);
            if (!$result['status']){
                return ['status' => false, 'code' => 400, 'message' => $result['message'], 'httpCode' => 400];
            }
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $question];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function destroy(int $id)
    {
        try {
            $question = Question::findOrFail($id);
            $question->folders()->detach();
            $question->delete();
            $result = (new AnswerService())->destroy($id);
            if (!$result['status']){
                return ['status' => false, 'code' => 400, 'message' => $result['message'], 'httpCode' => 400];
            }
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
