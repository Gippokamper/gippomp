<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Models\ArticleRead;
use App\Services\ArticleService;
use Illuminate\Http\Request;

class ArticleController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $articles = Article::orderBy('id')->paginate($request->get('perPage') ?? 12);
        return ArticleResource::collection($articles);
    }

    public function show(string $slug)
    {
        try {
            $article = Article::with(['categories', 'chapters', 'blocks'])->firstWhere('slug', $slug);
            return $this->successResponse('success', ArticleResource::make($article));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    /**
     * Oxirgi o'qilgan maqolalar — bosh sahifadagi "Davom ettirish" bloki uchun.
     *
     * `article_reads` da faqat foydalanuvchi va maqola bog'lanishi bor, shuning
     * uchun tartib yozuv qo'shilgan vaqt bo'yicha (eng oxirgisi birinchi).
     */
    public function recent(Request $request)
    {
        $limit = min((int) $request->get('limit', 6), 20);

        $articleIds = ArticleRead::where('user_id', auth('sanctum')->id())
            ->orderByDesc('id')
            ->limit($limit)
            ->pluck('article_id');

        if ($articleIds->isEmpty()) {
            return $this->successResponse('success', []);
        }

        $articles = Article::with('categories')
            ->whereIn('id', $articleIds)
            ->get()
            ->keyBy('id');

        // `whereIn` tartibni saqlamaydi — o'qilgan tartibiga qaytaramiz.
        $ordered = $articleIds
            ->map(fn ($id) => $articles->get($id))
            ->filter()
            ->values();

        return $this->successResponse('success', ArticleResource::collection($ordered));
    }

    public function read(int $id)
    {
        try {
            $save = ArticleRead::firstOrNew([
                'user_id' => auth('sanctum')->user()->id,
                'article_id' => $id
            ]);
            if ($save->exists){
                $save->delete();
            }else{
                $save->save();
            }
            return $this->successResponse('success');
        }catch (\Exception $e){
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }
}
