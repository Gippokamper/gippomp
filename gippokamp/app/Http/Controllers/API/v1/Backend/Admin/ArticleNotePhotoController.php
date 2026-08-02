<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleNotePhotoRequests\ArticleNotePhotoDeleteRequest;
use App\Http\Requests\ArticleNotePhotoRequests\ArticleNotePhotoRequest;
use App\Http\Resources\ArticleNotePhotoResource;
use App\Http\Resources\ArticleNoteTextResource;
use App\Models\ArticleNotePhoto;
use App\Services\ArticleNotePhotoService;
use Illuminate\Http\Request;

class ArticleNotePhotoController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $article_note_photos = ArticleNotePhoto::when($request->get('search'), function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->orWhereRaw("JSON_SEARCH(title, 'one', ?) IS NOT NULL", ['%' . $request->search . '%'])
                        ->orWhereRaw("JSON_SEARCH(description, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
                });
            })
            ->orderBy('id', 'desc')
            ->paginate($request->get('perPage') ?? 12);

        return ArticleNotePhotoResource::collection($article_note_photos);
    }

    public function store(ArticleNotePhotoRequest $request)
    {
        $result = (new ArticleNotePhotoService())->store($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), ArticleNotePhotoResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function show(int $id)
    {
        try {
            $category = ArticleNotePhoto::find($id);
            return $this->successResponse('success', ArticleNotePhotoResource::make($category));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(ArticleNotePhotoRequest $request, $id)
    {
        $result = (new ArticleNotePhotoService())->update($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']), ArticleNotePhotoResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function destroy(int $id)
    {
        $result = (new ArticleNotePhotoService())->destroy($id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function bulk_destroy(ArticleNotePhotoDeleteRequest $request)
    {
        $result = (new ArticleNotePhotoService())->bulk_destroy($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
