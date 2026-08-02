<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\Article;
use App\Models\CategoryHasArticle;
use App\Models\Feedback;
use App\Models\FeedbackMessage;
use App\Models\User;
use App\Traits\NotificationTrait;
use Illuminate\Support\Str;

class FeedbackService extends BaseService
{
    use NotificationTrait;
    public function adminStore($request)
    {
        try {
            if(isset($request['user_ids'][0])){
                foreach ($request['user_ids'] as $user_id){
                    $feedback = Feedback::create([
                        'user_id' => $user_id,
                        'type' => $request['type']
                    ]);
                    FeedbackMessage::create([
                        'feedback_id' => $feedback->id,
                        'author' => $request['author'],
                        'message' => $request['message'],
                    ]);
                    $this->sendNotification($user_id, $request['author'], $request['message']);
                }
            }else{
                $users = User::whereHas('roles', function ($query) {
                    $query->where('name', 'user');
                })->get();
                foreach ($users as $user){
                    $feedback = Feedback::create([
                        'user_id' => $user->id,
                        'type' => $request['type']
                    ]);
                    FeedbackMessage::create([
                        'feedback_id' => $feedback->id,
                        'author' => $request['author'],
                        'message' => $request['message'],
                    ]);
                    $this->sendNotification($user->id, $request['author'], $request['message']);
                }
            }
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $feedback->load('messages', 'user', 'article', 'block', 'question')];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 500, 'message' => $e->getMessage(), 'httpCode' => 500];
        }
    }

    public function store($request)
    {
        try {
            if (isset($request['article_slug'])){
                $article = Article::where('slug', $request['article_slug'])->first();
                if (!$article) {
                    return ['status' => false, 'code' => 404, 'message' => ResponseError::ERROR_404->value, 'httpCode' => 404];
                }
                $request['article_id'] = $article->id;
            }
            $feedback = Feedback::create($request);
            FeedbackMessage::create([
                'feedback_id' => $feedback->id,
                'author' => $request['author'],
                'message' => $request['message'],
            ]);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $feedback->load('messages', 'user', 'article', 'block', 'question')];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 500, 'message' => $e->getMessage(), 'httpCode' => 500];
        }
    }

    public function store_message($request, $id)
    {
        try {
            $feedback = Feedback::with('user')->findOrFail($id);
            $message = FeedbackMessage::create([
                'feedback_id' => $feedback->id,
                'author' => $request['author'],
                'message' => $request['message'],
            ]);
            $this->sendNotification($feedback->user->id, $request['author'], $request['message']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $message];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

}
