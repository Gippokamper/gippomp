<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttemptQuestionResource extends JsonResource
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
            'sort' => (int) $this->sort,
            'question' => $this->whenLoaded('question', function (){
                return QuestionResource::make($this->question);
            })
        ];
    }

}
