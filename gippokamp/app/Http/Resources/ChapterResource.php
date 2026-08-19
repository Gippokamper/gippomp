<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChapterResource extends JsonResource
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
            'title' => (array) $this->title,
            'description' => (array) $this->description,
            'paid' => (boolean) $this->paid,
            'article_ids' => $this->whenLoaded('articles', function (){
                return ArticleResource::collection($this->articles);
            }),
            'sort' => $this->whenLoaded('articles', function () {
                return $this->articles->pluck('pivot.sort')->implode(', ');
            }),
        ];
    }

}
