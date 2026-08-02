<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizResource extends JsonResource
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
            'with_child' => $this->whenLoaded('childQuiz', function () {
                return $this->childQuiz->isEmpty() ? false : true;
            }),
            'with_content' => $this->whenLoaded('blocks', function () {
                return $this->blocks->isEmpty() ? false : true;
            }),
            'slug' => (string) $this->slug,
            'sort' => (integer) $this->sort,
            'name' => (array) $this->name,
            'info' => (array) $this->info,
            'quiz_ids' => $this->whenLoaded('parentQuiz', function (){
                return QuizResource::collection($this->parentQuiz);
            }),
            'quiz_sort' => $this->whenLoaded('parentQuiz', function () {
                return $this->parentQuiz->pluck('pivot.sort')->implode(', ');
            }),
            'child_quiz' => $this->whenLoaded('childQuiz', function (){
                return QuizResource::collection($this->childQuiz);
            }),
            'blocks' => $this->whenLoaded('blocks', function (){
                return BlockResource::collection($this->blocks);
            })
        ];
    }

}
