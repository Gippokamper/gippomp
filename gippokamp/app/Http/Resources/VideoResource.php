<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
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
            'category_ids' => $this->whenLoaded('categories', function (){
                return VideoCategoryResource::collection($this->categories);
            }),
            'sort' => $this->whenLoaded('categories', function () {
                return $this->categories->pluck('pivot.sort')->implode(', ');
            }),
            'slug' => (string) $this->slug,
            'name' => (array) $this->name,
            'link' => (string) $this->link
        ];
    }

}
