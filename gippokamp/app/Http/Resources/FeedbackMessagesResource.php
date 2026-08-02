<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedbackMessagesResource extends JsonResource
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
            'feedback_id' => $this->whenLoaded('feedback', function (){
                return FeedbackResource::make($this->feedback);
            }),
            'author' => (string) $this->author,
            'message' => (string) $this->message
        ];
    }

}
