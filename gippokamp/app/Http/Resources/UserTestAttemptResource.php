<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserTestAttemptResource extends JsonResource
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
            'time' => (int) $this->time,
            'right_answer' => (int) $this->right_answer,
            'wrong_answer' => (int) $this->wrong_answer,
            'help_answer' => (int) $this->help_answer,
            'no_answer' => (int) $this->no_answer,
            'block_id' => $this->whenLoaded('block', function (){
                return BlockResource::make($this->block);
            }),
            'attempt_question' => $this->whenLoaded('attempt_question', function (){
                return AttemptQuestionResource::collection($this->attempt_question);
            }),
            'question_count' => $this->whenLoaded('attempt_question', function (){
                return $this->attempt_question->count();
            }),
        ];
    }

}
