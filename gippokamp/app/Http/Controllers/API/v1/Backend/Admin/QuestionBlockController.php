<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Enums\ResponseError;
use App\Http\Requests\QuestionBlockRequest;
use App\Http\Requests\QuestionRequests\FolderDeleteRequest;
use App\Http\Requests\QuestionRequests\QuestionDeleteRequest;
use App\Http\Requests\QuestionRequests\QuestionRequest;
use App\Http\Resources\BlockResource;
use App\Http\Resources\FolderResource;
use App\Http\Resources\QuestionResource;
use App\Http\Resources\VideoResource;
use App\Models\Folder;
use App\Models\Question;
use App\Models\QuestionBlock;
use App\Services\FolderService;
use App\Services\QuestionBlockService;
use App\Services\QuestionService;
use Illuminate\Http\Request;

class QuestionBlockController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function store(QuestionBlockRequest $request)
    {
        $request = $request->validated();
        $result = (new QuestionBlockService())->store($request['id'], $request['blocks'], $request['type']);
        if ($result['status']){
            return $this->successResponse(__($result['message']), BlockResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function update(QuestionBlockRequest $request, $id)
    {
        $result = (new QuestionBlockService())->update($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']), BlockResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function destroy(int $id)
    {
        $result = (new QuestionBlockService())->destroy($id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
