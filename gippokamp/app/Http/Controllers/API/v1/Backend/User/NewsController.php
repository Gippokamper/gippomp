<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Requests\NewsRequests\NewsDeleteRequest;
use App\Http\Requests\NewsRequests\NewsRequest;
use App\Http\Resources\NewsResource;
use App\Models\News;
use App\Models\NewsSave;
use App\Services\NewsService;
use Illuminate\Http\Request;

class NewsController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $userId = auth('sanctum')->user()->id;
        $news = News::orderBy('id', 'desc')
            ->when($request->get('actual'), function ($q, $request){
                $q->where('actual', true);
            })
            ->when($request->get('saved'), function ($query) use ($userId) {
                $query->whereHas('savedByUsers', function ($q) use ($userId) {
                    $q->where('users.id', $userId);
                });
            })
            ->paginate($request->get('perPage') ?? 12);
        return NewsResource::collection($news);
    }

    public function show(string $slug)
    {
        try {
            $new = News::firstWhere('slug', $slug);
            return $this->successResponse('success', NewsResource::make($new));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function save(int $id)
    {
        try {
            $save = NewsSave::firstOrNew([
                'user_id' => auth('sanctum')->user()->id,
                'news_id' => $id
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
