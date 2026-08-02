<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;


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

class QuestionController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        if ($request->get('folder_slug')){
            $folder = Folder::with(['questions'])
                ->firstWhere('slug', $request->get('folder_slug'));
            if (!$folder) {
                return $this->errorResponse(404, 'Folder not found', 404);
            }
            return QuestionResource::collection($folder->questions()->paginate($request->get('perPage') ?? 12));
        }else{
            $questions = Question::when($request->get('search'), function ($q) use ($request) {
                    $q->where(function ($query) use ($request) {
                        $query->orWhereRaw("JSON_SEARCH(name, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                    });
                })
                ->orderBy('id')
                ->paginate($request->get('perPage'));
            return QuestionResource::collection($questions);
        }
    }

    public function store(QuestionRequest $request)
    {
        $result = (new QuestionService())->store($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), FolderResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
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

    public function update(QuestionRequest $request, $id)
    {
        $result = (new QuestionService())->update($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']), FolderResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function destroy(int $id)
    {
        $result = (new QuestionService())->destroy($id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function bulk_destroy(QuestionDeleteRequest $request)
    {
        $result = (new QuestionService())->bulk_destroy($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
