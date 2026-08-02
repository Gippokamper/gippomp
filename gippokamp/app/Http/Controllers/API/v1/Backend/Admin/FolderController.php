<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;


use App\Enums\ResponseError;
use App\Http\Requests\FolderRequests\FolderDeleteRequest;
use App\Http\Requests\FolderRequests\FolderRequest;
use App\Http\Resources\FolderResource;
use App\Http\Resources\QuestionResource;
use App\Models\Folder;
use App\Services\FolderService;
use Illuminate\Http\Request;

class FolderController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        if ($request->get('slug')){
            $folder = Folder::with(['childFolder.questions', 'questions'])
                ->firstWhere('slug', $request->get('slug'));
            if (!$folder) {
                return $this->errorResponse(404, 'Folder not found', 404);
            }
            if (!$folder->childFolder->isEmpty()){
                return FolderResource::collection($folder->childFolder()->paginate($request->get('perPage') ?? 12));
            }
            return QuestionResource::collection($folder->questions()->paginate($request->get('perPage') ?? 12));
        } elseif($request->get('without_child')){
            $folders = Folder::whereDoesntHave('childFolder')->paginate($request->get('perPage') ?? 12);
            return FolderResource::collection($folders);
        }
        $folders = Folder::whereDoesntHave('parentFolder')->paginate($request->get('perPage') ?? 12);
        return FolderResource::collection($folders);
    }

    public function store(FolderRequest $request)
    {
        $result = (new FolderService())->store($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), FolderResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function show(int $id)
    {
        try {
            $video = Folder::with(['parentFolder', 'childFolder.questions'])->findOrFail($id);
            return $this->successResponse('success', FolderResource::make($video));
        }catch (\Exception $e){
            return $this->errorResponse(404, __(ResponseError::ERROR_404->value), 404);
        }
    }

    public function update(FolderRequest $request, $id)
    {
        $result = (new FolderService())->update($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']), FolderResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function destroy(int $id)
    {
        $result = (new FolderService())->destroy($id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function questions_string(Request $request, string $slug)
    {
        try {
            if ($request->get('type') == 'parent'){
                $folder = Folder::with(['childFolder.questions'])->firstWhere('slug', $slug);
                $questions = $folder->childFolder->flatMap(function ($childFolder) {
                    return $childFolder->questions->pluck('id');
                });
            }else{
                $folder = Folder::with(['questions'])->firstWhere('slug', $slug);
                $questions = $folder->questions->pluck('id');
            }

            return $this->successResponse('success', [
                'folder_slug' => $slug,
                'questions_string' => $questions
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse(404, __(ResponseError::ERROR_404->value), 404);
        }
    }

    public function bulk_destroy(FolderDeleteRequest $request)
    {
        $result = (new FolderService())->bulk_destroy($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
