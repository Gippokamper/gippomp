<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleNoteTextRequests\ArticleNoteTextDeleteRequest;
use App\Http\Requests\ArticleNoteTextRequests\ArticleNoteTextRequest;
use App\Http\Resources\ArticleNoteTextResource;
use App\Models\ArticleNoteText;
use App\Services\ArticleNoteTextService;
use Illuminate\Http\Request;

class ArticleNoteTextController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $article_note_texts = ArticleNoteText::orderBy('id')->paginate($request->get('perPage') ?? 12);
        return ArticleNoteTextResource::collection($article_note_texts);
    }

    public function show(int $id)
    {
        try {
            $article_note_text = ArticleNoteText::findOrFail($id);
            return $this->successResponse('success', ArticleNoteTextResource::make($article_note_text));
        }catch (\Exception $e){
            return $this->errorResponse(404, __(ResponseError::ERROR_404->value), 404);
        }
    }
}
