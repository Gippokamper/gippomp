<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\VideoResource;
use App\Models\Article;
use App\Models\ArticleRead;
use App\Models\Chapter;
use App\Models\QuestionBlock;
use App\Models\Video;
use App\Services\ArticleService;
use Illuminate\Http\Request;

class SearchController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Umumiy qidiruv — bosh sahifadagi suhbat shu yerdan javob oladi.
     *
     * Ilgari faqat maqola va boblarni qaytarardi. Suhbat butun platformaga
     * kirish nuqtasi bo'lgani uchun videolar va test mavzulari ham qo'shildi:
     * talaba "gastrit" deb yozsa, maqola ham, video ham, shu mavzudagi test
     * ham bir javobda chiqadi.
     */
    public function search()
    {
        $query = trim((string) request()->search);

        if ($query === '') {
            return $this->successResponse('success', [
                'articles' => [], 'chapters' => [], 'videos' => [], 'blocks' => [],
            ]);
        }

        $like = '%' . $query . '%';

        $articleResults = Article::where('name', 'LIKE', $like)->limit(10)->get();

        /*
         * Boblar: avval sarlavha bo'yicha, keyin kerak bo'lsa matn bo'yicha.
         *
         * Ilgari ikkalasi bitta `orWhere` da edi va bob matni uzun HTML
         * bo'lgani uchun deyarli har so'zga 10 ta bob qaytardi — javob
         * shovqinga to'lardi. Endi sarlavhaga mos kelgani ustun turadi.
         */
        $chapterResults = Chapter::with(['articles'])
            ->where('title', 'LIKE', $like)
            ->limit(5)
            ->get();

        if ($chapterResults->count() < 5) {
            $byText = Chapter::with(['articles'])
                ->where('description', 'LIKE', $like)
                ->whereNotIn('id', $chapterResults->pluck('id'))
                ->limit(20)
                ->get();

            $chapterResults = $chapterResults->concat($byText);
        }

        /*
         * Maqolaning o'zi topilgan bo'lsa, uning boblari ro'yxatda takror
         * bo'lmasin: "gastrit" so'roviga "Gastrit" maqolasi va uning ostidan
         * "Umumiy ma'lumot", "Ta'rif", "Etiologiyasi" chiqib, natija
         * ma'nosiz to'lib ketardi.
         */
        $foundArticleIds = $articleResults->pluck('id');

        $chapterResults = $chapterResults
            ->reject(fn ($chapter) => $chapter->articles->pluck('id')->intersect($foundArticleIds)->isNotEmpty())
            ->take(5)
            ->values();

        $videoResults = Video::with('categories')
            ->where('name', 'LIKE', $like)
            ->limit(10)
            ->get();

        // Savol bloklari — "shu mavzudan test yechish" taklifi uchun.
        $blockResults = QuestionBlock::where('name', 'LIKE', $like)
            ->limit(10)
            ->get()
            ->map(fn ($block) => [
                'id'    => (int) $block->id,
                'slug'  => (string) $block->slug,
                'name'  => (array) $block->name,
                'count' => $block->questions()->count(),
            ])
            ->values();

        return $this->successResponse('success', [
            'articles' => ArticleResource::collection($articleResults),
            'chapters' => ChapterResource::collection($chapterResults),
            'videos'   => VideoResource::collection($videoResults),
            'blocks'   => $blockResults,
        ]);
    }
}
