<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoCategoryResource extends JsonResource
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
            'category_ids' => $this->whenLoaded('parentCategory', function (){
                return CategoryResource::collection($this->parentCategory);
            }),
            'category_sort' => $this->whenLoaded('parentCategory', function () {
                return $this->parentCategory->pluck('pivot.sort')->implode(', ');
            }),
            'child_category' => $this->whenLoaded('childCategory', function (){
                return CategoryResource::collection($this->childCategory);
            }),
            'slug' => (string) $this->slug,
            'name' => (array) $this->name,
            'videos' => $this->whenLoaded('videos', function (){
                return VideoResource::collection($this->videos);
            })
        ];
    }

}
