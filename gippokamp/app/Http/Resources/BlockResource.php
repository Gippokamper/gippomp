<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlockResource extends JsonResource
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
            'slug' => (string) $this->slug,
            'name' => (array) $this->name,
            'questions' => $this->whenLoaded('questions', function (){
                return QuestionResource::collection($this->questions);
            }),
            'questions_string' => $this->whenLoaded('questions', function (){
                return $this->questions->pluck('id')->join(',');
            }),
            'questions_count' => $this->whenLoaded('questions', function (){
                return $this->questions->count();
            }),
            'solved' => auth('sanctum')->check() ? $this->solved_questions(auth('sanctum')->id()) : null
        ];
    }

}
