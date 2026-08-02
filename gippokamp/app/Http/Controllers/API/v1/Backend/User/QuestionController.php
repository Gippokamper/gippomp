<?php

namespace App\Http\Controllers\API\v1\Backend\User;


use App\Enums\ResponseError;
use App\Http\Requests\QuestionRequests\FolderDeleteRequest;
use App\Http\Requests\QuestionRequests\QuestionDeleteRequest;
use App\Http\Requests\QuestionRequests\QuestionRequest;
use App\Http\Resources\FolderResource;
use App\Http\Resources\QuestionResource;
use App\Http\Resources\VideoResource;
use App\Models\Folder;
use App\Models\Question;
use App\Services\FolderService;
use App\Services\QuestionService;
use Illuminate\Http\Request;

class QuestionController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $questions = Question::orderBy('id')->paginate($request->get('perPage'));
        return QuestionResource::collection($questions);
    }

    public function show(int $id)
    {
        try {
            $question = Question::with(['folders', 'answers'])->findOrFail($id);
            return $this->successResponse('success', QuestionResource::make($question));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }
}
