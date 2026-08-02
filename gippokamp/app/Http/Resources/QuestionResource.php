<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'type' => 'questions',
            'id' => (int) $this->id,
            'folder_ids' => $this->whenLoaded('folders', function (){
                return FolderResource::collection($this->folders);
            }),
            'photo' => (array) $this->photo,
            'name' => (array) $this->name,
            'additional_info' => (array) $this->additional_info,
            'answers' => $this->whenLoaded('randomAnswers', function (){
                return AnswerResource::collection($this->randomAnswers);
            }, function (){
                return AnswerResource::collection($this->answers);
            }),
        ];
    }

}
