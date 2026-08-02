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

class FeedbackSiteController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $feedbacks = FeedbackSite::orderBy('id', 'desc')->paginate($request->perPage ?? 12);
        return FeedbackSiteResource::collection($feedbacks);
    }

    public function show(FeedbackSite $feedbackSite)
    {
        return FeedbackSiteResource::make($feedbackSite);
    }
}
