<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\Answer;
use App\Models\Article;
use App\Models\Question;
use Illuminate\Support\Str;

class AnswerService extends BaseService
{
    public function store($answers, $question_id)
    {
        try {
            foreach ($answers as $answer){
                Answer::create([
                    'question_id' => $question_id,
                    'photos' => $answer['photos'],
                    'name' => $answer['name'],
                    'description' => $answer['description'],
                    'link' => $answer['link'],
                    'status' => $answer['status'],
                ]);
            }
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($answers, $id)
    {
        try {
            Answer::where('question_id', $id)->delete();
            $this->store($answers, $id);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function destroy($id)
    {
        try {
            Answer::where('question_id', $id)->delete();
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
}
