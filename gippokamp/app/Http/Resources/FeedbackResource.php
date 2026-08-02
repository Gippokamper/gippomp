<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedbackResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'user_id' => $this->whenLoaded('user', function (){
                return UserResource::make($this->user);
            }),
            'article_id' => $this->whenLoaded('article', function (){
                return ArticleResource::make($this->article);
            }),
            'block_id' => $this->whenLoaded('block', function (){
                return BlockResource::make($this->block);
            }),
            'question_id' => $this->whenLoaded('question', function (){
                return QuestionResource::make($this->question);
            }),
            'chapter_id' => $this->whenLoaded('chapter', function (){
                return ChapterResource::make($this->chapter);
            }),
            'type' => (string) $this->type,
            'messages' => $this->whenLoaded('messages', function (){
                return FeedbackMessagesResource::collection($this->messages);
            }),
        ];
    }

}
