<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleNoteTextRequests\ArticleNoteTextDeleteRequest;
use App\Http\Requests\ArticleNoteTextRequests\ArticleNoteTextRequest;
use App\Http\Resources\ArticleNoteTextResource;
use App\Models\ArticleNoteText;
use App\Services\ArticleNoteTextService;
use Illuminate\Http\Request;

class ArticleNoteTextController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $article_note_texts = ArticleNoteText::when($request->get('search'), function ($q) use ($request) {
            $q->where(function ($query) use ($request) {
                $query->orWhereRaw("JSON_SEARCH(title, 'one', ?) IS NOT NULL", ['%' . $request->search . '%'])
                    ->orWhereRaw("JSON_SEARCH(description, 'one', ?) IS NOT NULL", ['%' . $request->search . '%']);
            });
        })
            ->orderBy('id', 'desc')
            ->paginate($request->get('perPage') ?? 12);
        return ArticleNoteTextResource::collection($article_note_texts);
    }

    public function store(ArticleNoteTextRequest $request)
    {
        $result = (new ArticleNoteTextService())->store($request->validated());
        if ($result['status']){
            return $this->successResponse(__($result['message']), ArticleNoteTextResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function show(int $id)
    {
        try {
            $category = ArticleNoteText::findOrFail($id);
            return $this->successResponse('success', ArticleNoteTextResource::make($category));
        }catch (\Exception $e){
            return $this->errorResponse(404, __(ResponseError::ERROR_404->value), 404);
        }
    }

    public function update(ArticleNoteTextRequest $request, $id)
    {
        $result = (new ArticleNoteTextService())->update($request->validated(), $id);
        if ($result['status']){
            return $this->successResponse(__($result['message']), ArticleNoteTextResource::make($result['data']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function destroy(int $id)
    {
        $result = (new ArticleNoteTextService())->destroy($id);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }

    public function bulk_destroy(ArticleNoteTextDeleteRequest $request)
    {
        $result = (new ArticleNoteTextService())->bulk_destroy($request);
        if ($result['status']){
            return $this->successResponse(__($result['message']));
        }
        return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
    }
}
