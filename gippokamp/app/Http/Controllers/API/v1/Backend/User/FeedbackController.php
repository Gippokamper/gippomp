<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Requests\FeedbackMessageRequest;
use App\Http\Requests\FeedbackRequest;
use App\Http\Requests\FeedbackSiteRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\FeedbackMessagesResource;
use App\Http\Resources\FeedbackResource;
use App\Http\Resources\FeedbackSiteResource;
use App\Models\Article;
use App\Models\Feedback;
use App\Models\FeedbackMessage;
use App\Models\FeedbackSite;
use App\Services\ArticleService;
use App\Services\FeedbackService;
use Illuminate\Http\Request;

class FeedbackController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $feedback = Feedback::with(['article', 'block', 'question', 'messages', 'chapter'])
            ->when(isset($request->type), function ($q) use ($request){
                $q->where('type', $request->type);
            })
            ->where('user_id', auth('sanctum')->user()->id)
            ->orderBy('id', 'desc')
            ->paginate($request->perPage ?? 12);
        return FeedbackResource::collection($feedback);
    }

    public function notification(Request $request)
    {
        $feedback = FeedbackMessage::with('feedback')
            ->whereHas('feedback.user', function ($q){
                $q->where('id', auth('sanctum')->user()->id);
            })
            ->where('author', 'admin')
            ->where('user_is_read', 0)
            ->get();
        return FeedbackMessagesResource::collection($feedback);
    }

    public function is_read(int $id)
    {
        try {
            // Faqat o'ziga tegishli feedback (IDOR oldini olish).
            $feedback = Feedback::with(['messages'])
                ->where('user_id', auth('sanctum')->user()->id)
                ->findOrFail($id);
            foreach ($feedback->messages as $message){
                $message->update([
                    'user_is_read' => 1
                ]);
            }
            return $this->successResponse('success');
        }catch (\Exception $e){
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }

    public function storeSite(FeedbackSiteRequest $request)
    {
        $request = $request->validated();
        $feedback = FeedbackSite::create($request);
        return FeedbackSiteResource::make($feedback);
    }

    public function store(FeedbackRequest $request)
    {
        try {
            $result = (new FeedbackService())->store($request->validated());
            if ($result['status']){
                return $this->successResponse(__($result['message']), FeedbackResource::make($result['data']));
            }
            return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
        }catch (\Exception $e){
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }

    public function store_message(FeedbackMessageRequest $request, int $id)
    {
        try {
            // Faqat o'ziga tegishli feedback thread'iga xabar yozish mumkin (IDOR oldini olish).
            if (!Feedback::where('id', $id)->where('user_id', auth('sanctum')->user()->id)->exists()) {
                return $this->errorResponse(404, 'Feedback not found', 404);
            }
            $result = (new FeedbackService())->store_message($request->validated(), $id);
            if ($result['status']){
                return $this->successResponse(__($result['message']), FeedbackMessagesResource::make($result['data']));
            }
            return $this->errorResponse($result['code'], __($result['message']), $result['httpCode']);
        }catch (\Exception $e){
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }
}
