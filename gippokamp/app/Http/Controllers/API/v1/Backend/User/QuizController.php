<?php

namespace App\Http\Controllers\API\v1\Backend\User;


use App\Enums\ResponseError;
use App\Http\Requests\QuizRequests\QuizDeleteRequest;
use App\Http\Requests\QuizRequests\QuizRequest;
use App\Http\Resources\QuizResource;
use App\Models\Quiz;
use App\Services\QuizService;
use Illuminate\Http\Request;

class QuizController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
//        if($request->get('without_child')){
            $quizzes = Quiz::with('childQuiz.childQuiz', 'blocks.questions')
                ->whereDoesntHave('parentQuiz')
                ->paginate($request->get('perPage') ?? 12);
            return QuizResource::collection($quizzes);
//        }
//        elseif($request->get('with_content')){
//            $plans = Quiz::with(['blocks'])
//                ->whereHas('blocks')
//                ->paginate($request->get('perPage') ?? 12);
//        }else{
//            $plans = Quiz::orderBy('id')->paginate($request->get('perPage') ?? 12);
//        }
//        return QuizResource::collection($plans);
    }

    public function show(string $slug)
    {
        try {
            $quiz = Quiz::with(['childQuiz.childQuiz', 'childQuiz.blocks.questions', 'blocks.questions'])->firstWhere('slug', $slug);
            return $this->successResponse('success', QuizResource::make($quiz));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }
}
