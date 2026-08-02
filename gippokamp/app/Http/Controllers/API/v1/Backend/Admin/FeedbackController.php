<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Enums\ResponseError;
use App\Http\Requests\AdminFeedbackRequest;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Requests\FeedbackMessageRequest;
use App\Http\Requests\FeedbackRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\FeedbackMessagesResource;
use App\Http\Resources\FeedbackResource;
use App\Models\Article;
use App\Models\Feedback;
use App\Models\FeedbackMessage;
use App\Services\ArticleService;
use App\Services\FeedbackService;
use Illuminate\Http\Request;

class FeedbackController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $feedback = Feedback::with(['user', 'article', 'block', 'question', 'messages'])
            ->when(isset($request->type), function ($q) use ($request){
                $q->where('type', $request->type);
            })
            ->orderBy('id', 'desc')
            ->paginate($request->perPage ?? 12);
        return FeedbackResource::collection($feedback);
    }

    public function notification(Request $request)
    {
        try {
            $feedback = FeedbackMessage::with('feedback.user')
                ->where('author', 'user')
                ->where('admin_is_read', 0)
                ->orderBy('id', 'desc')
                ->get();
            return FeedbackMessagesResource::collection($feedback);
        }catch (\Exception $e){
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }

    public function is_read(int $id)
    {
        try {
            $feedback = Feedback::with(['messages'])->findOrFail($id);
            foreach ($feedback->messages as $message){
                $message->update([
                    'admin_is_read' => 1
                ]);
            }
            return $this->successResponse('success');
        }catch (\Exception $e){
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }

    public function store(AdminFeedbackRequest $request)
    {
        try {
            $result = (new FeedbackService())->adminStore($request->validated());
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
