<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;


use App\Enums\ResponseError;
use App\Http\Requests\QuizRequests\QuizDeleteRequest;
use App\Http\Requests\QuizRequests\QuizRequest;
use App\Http\Resources\QuizResource;
use App\Models\Quiz;
use App\Services\QuizService;
use Illuminate\Http\Request;

class QuizController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        if($request->get('without_child')){
            $quizzes = Quiz::with(['parentQuiz'])
                ->whereDoesntHave('blocks')
                ->when($request->get('search'), function ($q) use ($request) {
                    $q->where(function ($query) use ($request) {
                        $query->orWhereRaw("JSON_SEARCH(name, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                    });
                })
                ->paginate($request->get('perPage') ?? 12);
        } elseif($request->get('with_content')){
            $quizzes = Quiz::with(['parentQuiz', 'blocks'])
                ->whereHas('blocks')
                ->paginate($request->get('perPage') ?? 12);
        }else{
            $quizzes = Quiz::with(['parentQuiz'])->when($request->get('search'), function ($q) use ($request) {
                    $q->where(function ($query) use ($request) {
                        $query->orWhereRaw("JSON_SEARCH(name, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                    });
                })
                ->orderBy('id')
                ->paginate($request->get('perPage') ?? 12);
        }
        return QuizResource::collection($quizzes);
    }

    public function store(QuizRequest $request)
    {
        $result = (new QuizService())->store($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), QuizResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function show(int $id)
    {
        try {
            $quiz = Quiz::with(['parentQuiz', 'blocks.questions'])->findOrFail($id);
            return $this->successResponse('success', QuizResource::make($quiz));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(QuizRequest $request, $id)
    {
        $result = (new QuizService())->update($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']), QuizResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function destroy(int $id)
    {
        $result = (new QuizService())->destroy($id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function bulk_destroy(QuizDeleteRequest $request)
    {
        $result = (new QuizService())->bulk_destroy($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
