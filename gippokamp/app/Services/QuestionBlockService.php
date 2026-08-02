<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Http\Controllers\API\v1\Backend\User\UserTestAttemptController;
use App\Models\Article;
use App\Models\AttemptQuestion;
use App\Models\QuestionBlock;
use App\Models\Quiz;
use App\Models\StudyPlan;
use App\Models\Video;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class QuestionBlockService extends BaseService
{
    public function store(int $id, array $blocks, string $type)
    {
        try {
            if ($type == 'study_plan'){
                $data = StudyPlan::find($id);
            }elseif($type == 'article'){
                $data = Article::find($id);
            } elseif($type == 'quiz'){
                $data = Quiz::find($id);
            }
            foreach ($blocks as $block){
                $test_block = new QuestionBlock([
                    'slug' => Str::slug($block['name']['uz']),
                    'name' => $block['name'],
                    'sort' => $block['sort'],
                ]);
                $data->blocks()->save($test_block);
                $test_block->questions()->attach($block['question_ids']);
            }
          return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $test_block];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update(array $request, int $id)
    {
        try {
            $test_block = QuestionBlock::findOrFail($id);
            $request = $request['blocks'][0];
            $test_block->update([
                'slug' => Str::slug($request['name']['ru']),
                'name' => $request['name'],
                'sort' => $request['sort'],
            ]);
            $test_block->questions()->sync($request['question_ids']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $test_block];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function destroy(int $id)
    {
        try {
            DB::beginTransaction();

            $test_block = QuestionBlock::with(['questions', 'attempts.attempt_question'])->findOrFail($id);
            $test_block->questions()->detach();
            foreach ($test_block->attempts as $attempt){
                $attempt->attempt_question()->delete();
                $attempt->delete();
            }
            $test_block->delete();

            DB::commit();
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $test_block];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['status' => false, 'code' => 404, 'message' => $e->getMessage(), 'httpCode' => 404];
        }
    }
}
