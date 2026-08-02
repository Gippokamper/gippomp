<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\AttemptQuestionResource;
use App\Http\Resources\QuestionResource;
use App\Http\Resources\UserTestAttemptResource;
use App\Models\Article;
use App\Models\AttemptQuestion;
use App\Models\Question;
use App\Models\QuestionBlock;
use App\Models\UserTestAttempt;
use App\Services\ArticleService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UserTestAttemptController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        try {
            $attempts = UserTestAttempt::with('block', 'attempt_question')
                ->orderBy('id')
                ->where('user_id', auth('sanctum')->user()->id)
                ->get();
            return UserTestAttemptResource::collection($attempts);
        }catch (\Exception $e){
            return $this->errorResponse(400, $e->getMessage(), 400);
        }
    }

    public function start(int $block_id)
    {
        try {
            if (QuestionBlock::find($block_id)){
                $attempt = UserTestAttempt::where('user_id', auth('sanctum')->user()->id)
                    ->where('block_id', $block_id)
                    ->first();
                if (!$attempt){
                    DB::transaction(function () use ($block_id, &$attempt){
                        $attempt = UserTestAttempt::create([
                            'user_id' => auth('sanctum')->user()->id,
                            'block_id' => $block_id,
                        ]);

                        $block = QuestionBlock::with(['questions'])->find($block_id);
                        foreach ($block->questions as $key=>$question){
                            AttemptQuestion::create([
                                'sort' => ++$key,
                                'attempt_id' => $attempt->id,
                                'question_id' => $question->id,
                            ]);
                        }
                    });
                    return UserTestAttemptResource::make($attempt->load(['attempt_question.question.randomAnswers', 'block']));
                }else{
                    $statuses = [];
                    if (!is_null(request()->right_answer)) {
                        $statuses[] = request()->right_answer;
                    }
                    if (!is_null(request()->wrong_answer)) {
                        $statuses[] = request()->wrong_answer;
                    }
                    if (!is_null(request()->help_answer)) {
                        $statuses[] = request()->help_answer;
                    }
                    if (!is_null(request()->no_answer)) {
                        $statuses[] = request()->no_answer;
                    }

                    return UserTestAttemptResource::make($attempt->load([
                        'attempt_question' => function ($query) use ($statuses) {
                            if (!empty($statuses)) {
                                $query->whereIn('status', $statuses);
                            }
                        },
                        'attempt_question.question.randomAnswers',
                        'block'
                    ]));
                }
            }
            throw new \Exception(ResponseError::ERROR_404->value, ResponseAlias::HTTP_NOT_FOUND);
        }catch (\Exception $e){
            return $this->errorResponse(400, $e->getMessage(), 400);
        }
    }

    public function finish(Request $request, int $block_id)
    {
//        try {
//            $attempt = UserTestAttempt::where('user_id', auth('sanctum')->user()->id)
//                ->where('block_id', $block_id)
//                ->first();
//            if ($attempt){
//                    foreach ($request['attempt_questions'] as $attempt_question){
//                        AttemptQuestion::find($attempt_question['question_id'])->update([
//                            'status' => $attempt_question['status']
//                        ]);
//                    }
//                    $attempt = $attempt->load('attempt_question');
//                     $attempt->update([
//                        'time' => $request['time'],
//                        'right_answer' => $attempt->attempt_question->where('status', 1)->count(),
//                        'wrong_answer' => $attempt->attempt_question->where('status', 0)->count(),
//                        'help_answer' => $attempt->attempt_question->where('status', -1)->count(),
//                        'no_answer' => $attempt->attempt_question->where('status', 2)->count(),
//                    ]);
//                return $this->successResponse('success');
//            }else{
//                return $this->errorResponse(404, 'Not found!', 404);
//            }
//        }catch (\Exception $e){
//            return $this->errorResponse(404, $e->getMessage(), 404);
//        }
        try {
            $user = auth('sanctum')->user();

            $attempt = UserTestAttempt::where('user_id', $user->id)
                ->where('block_id', $block_id)
                ->first();

            if (!$attempt) {
                return $this->errorResponse(404, 'Not found!', 404);
            }

            // Собираем ID вопросов и их статусы для массового обновления
            $updates = collect($request['attempt_questions'])
                ->mapWithKeys(function ($item) {
                    return [$item['question_id'] => ['status' => $item['status']]];
                })
                ->toArray();

            // Faqat shu urinishga tegishli savollarni yangilaymiz (IDOR oldini olish).
            $attempt->attempt_question()->whereIn('id', array_keys($updates))
                ->get()
                ->each(function ($attemptQuestion) use ($updates) {
                    if (isset($updates[$attemptQuestion->id])) {
                        $attemptQuestion->update($updates[$attemptQuestion->id]);
                    }
                });

            // Перезагрузим данные для актуальности данных.
            $attempt->load('attempt_question');

            $attempt->update([
                'time' => $request['time'],
                'right_answer' => $attempt->attempt_question->where('status', 1)->count(),
                'wrong_answer' => $attempt->attempt_question->where('status', 0)->count(),
                'help_answer' => $attempt->attempt_question->where('status', -1)->count(),
                'no_answer' => $attempt->attempt_question->where('status', 2)->count(),
            ]);

            return $this->successResponse('success');
        } catch (\Exception $e) {
            return $this->errorResponse(404, $e->getMessage(), 404);
        }

    }

    public function statistics(int $block_id)
    {
        try {
            $attempt = UserTestAttempt::with('block', 'attempt_question')
                ->where('user_id', auth('sanctum')->user()->id)
                ->where('block_id', $block_id)
                ->first();
            return UserTestAttemptResource::make($attempt);
        }catch (\Exception $e){
            return $this->errorResponse(400, $e->getMessage(), 400);
        }
    }
}
