<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'slug' => (string) $this->slug,
            'icon' => (string) $this->icon,
            'sort' => (integer) $this->sort,
            'name' => (array) $this->name,
            'paid' => (boolean) $this->paid,
            'category_ids' => $this->whenLoaded('parentCategory', function (){
                return CategoryResource::collection($this->parentCategory);
            }),
            'category_sort' => $this->whenLoaded('parentCategory', function () {
                return $this->parentCategory->pluck('pivot.sort')->implode(', ');
            }),
            'child_category' => $this->whenLoaded('childCategory', function (){
                return CategoryResource::collection($this->childCategory);
            }),
            'articles' => $this->whenLoaded('articles', function (){
                return ArticleResource::collection($this->articles);
            })
        ];
    }

}
