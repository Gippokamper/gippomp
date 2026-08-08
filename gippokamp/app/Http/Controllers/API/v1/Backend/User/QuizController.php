<?php

namespace App\Http\Controllers\API\v1\Backend\User;


use App\Enums\ResponseError;
use App\Http\Requests\QuizRequests\QuizDeleteRequest;
use App\Http\Requests\QuizRequests\QuizRequest;
use App\Http\Resources\QuizResource;
use App\Models\Quiz;
use App\Services\QuizService;
use App\Services\QuizTreeService;
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

    /**
     * Butun bo'limlar daraxti — chuqurligi cheklanmagan, har bir tugunda
     * savollar soni, foydalanuvchi yechgani va "bajarildi" belgisi bilan.
     */
    public function tree()
    {
        return $this->successResponse('success', (new QuizTreeService())->tree(auth('sanctum')->id()));
    }

    /** Bo'limni (va ichidagi hammasini) "bajardim" deb belgilash. */
    public function complete(string $slug)
    {
        $quiz = Quiz::firstWhere('slug', $slug);

        if (!$quiz) {
            return $this->errorResponse(404, 'Quiz not found', 404);
        }

        (new QuizTreeService())->complete(auth('sanctum')->id(), $quiz->id);

        return $this->successResponse('success', (new QuizTreeService())->tree(auth('sanctum')->id()));
    }

    /** Belgini bo'limdan (va ichidagilardan) olib tashlash. */
    public function uncomplete(string $slug)
    {
        $quiz = Quiz::firstWhere('slug', $slug);

        if (!$quiz) {
            return $this->errorResponse(404, 'Quiz not found', 404);
        }

        (new QuizTreeService())->uncomplete(auth('sanctum')->id(), $quiz->id);

        return $this->successResponse('success', (new QuizTreeService())->tree(auth('sanctum')->id()));
    }
}
