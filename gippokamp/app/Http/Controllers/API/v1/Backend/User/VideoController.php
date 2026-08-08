<?php

namespace App\Http\Controllers\API\v1\Backend\User;


use App\Enums\ResponseError;
use App\Http\Requests\VideoRequests\VideoDeleteRequest;
use App\Http\Requests\VideoRequests\VideoRequest;
use App\Http\Resources\VideoResource;
use App\Models\Video;
use App\Models\VideoCategory;
use App\Services\VideoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VideoController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Videolar ro'yxati — qidiruv, janr va saralash bilan.
     *
     * Parametrlar:
     *   search       — nom bo'yicha (uz/ru/en, hammasi bir vaqtda)
     *   categories[] — janr slug'lari; ichki kategoriyalar ham qamrab olinadi
     *   sort         — new (default) | old | name
     */
    public function index(Request $request)
    {
        $videos = Video::with('categories');

        $search = trim((string) $request->get('search'));

        if ($search !== '') {
            /*
             * `name` — JSON ustun, ustiga kirillcha matn u yerda `\uXXXX`
             * ko'rinishida yotadi. Shuning uchun xom ustunga LIKE qo'llab
             * bo'lmaydi — qiymatni ochib olish kerak:
             *   MySQL/MariaDB — json_unquote(json_extract(...))
             *   SQLite        — json_extract o'zi ochilgan matn qaytaradi
             * LOWER esa ikkalasida ham registrni tenglashtiradi.
             */
            $isSqlite = $videos->getConnection()->getDriverName() === 'sqlite';
            $needle   = '%' . mb_strtolower($search) . '%';

            $videos->where(function ($query) use ($needle, $isSqlite) {
                foreach (['uz', 'ru', 'en'] as $lang) {
                    $extract = "json_extract(name, '$.\"$lang\"')";
                    $value   = $isSqlite ? $extract : "json_unquote($extract)";

                    $query->orWhereRaw("LOWER($value) LIKE ?", [$needle]);
                }
            });
        }

        $slugs = array_filter((array) $request->get('categories', []));

        if ($slugs) {
            $ids = $this->categoryIdsWithDescendants($slugs);
            $videos->whereHas('categories', fn ($q) => $q->whereIn('video_categories.id', $ids));
        }

        match ($request->get('sort')) {
            'old'   => $videos->orderBy('id'),
            'name'  => $videos->orderBy('name'),
            default => $videos->orderByDesc('id'),
        };

        return VideoResource::collection($videos->paginate($request->get('perPage') ?? 12));
    }

    /**
     * Tanlangan janrlar + ularning ichidagi barcha janrlar.
     *
     * Kategoriya daraxti ko'p-ko'pga bog'lanish orqali qurilgan, ya'ni sikl
     * bo'lishi mumkin — shuning uchun ko'rilganlar to'plami bilan yuriladi.
     */
    private function categoryIdsWithDescendants(array $slugs): array
    {
        $edges = DB::table('video_category_has_video_categories')
            ->get(['parent_category_id', 'child_category_id']);

        $children = [];
        foreach ($edges as $edge) {
            $children[(int) $edge->parent_category_id][] = (int) $edge->child_category_id;
        }

        $stack = VideoCategory::whereIn('slug', $slugs)->pluck('id')->map(fn ($id) => (int) $id)->all();
        $seen  = [];

        while ($stack) {
            $id = array_pop($stack);

            if (isset($seen[$id])) {
                continue;
            }

            $seen[$id] = true;

            foreach ($children[$id] ?? [] as $childId) {
                $stack[] = $childId;
            }
        }

        return array_keys($seen);
    }

    public function show(string $slug)
    {
        try {
            $video = Video::with(['categories'])->firstWhere('slug', $slug);
            return $this->successResponse('success', VideoResource::make($video));
        }catch (\Exception $e){
            return $this->errorResponse(404, __(ResponseError::ERROR_404->value), 404);
        }
    }
}
