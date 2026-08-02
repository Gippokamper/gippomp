<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryLandingResource extends JsonResource
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
            'name' => (array) $this->name,
            'photo' => (string) $this->photo,
            'category_id' => $this->whenLoaded('parentCategory', function (){
                return CategoryLandingResource::make($this->parentCategory);
            }),
            'child_category' => $this->whenLoaded('childCategory', function (){
                return CategoryLandingResource::collection($this->childCategory);
            }),
        ];
    }

}
