<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleNotePhotoRequests\ArticleNotePhotoDeleteRequest;
use App\Http\Requests\ArticleNotePhotoRequests\ArticleNotePhotoRequest;
use App\Http\Resources\ArticleNotePhotoResource;
use App\Http\Resources\ArticleNoteTextResource;
use App\Models\ArticleNotePhoto;
use App\Services\ArticleNotePhotoService;
use Illuminate\Http\Request;

class ArticleNotePhotoController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $article_note_photos = ArticleNotePhoto::orderBy('id')->paginate($request->get('perPage') ?? 12);
        return ArticleNotePhotoResource::collection($article_note_photos);
    }

    public function show(int $id)
    {
        try {
            $article_note_photo = ArticleNotePhoto::findOrFail($id);
            return $this->successResponse('success', ArticleNotePhotoResource::make($article_note_photo));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

}
