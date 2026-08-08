<?php

namespace App\Http\Resources;

use App\Models\Article;
use App\Models\ArticleRead;
use App\Models\UserSave;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
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
                return CategoryResource::collection($this->categories);
            }),
            'sort' => $this->whenLoaded('categories', function () {
                return $this->categories->pluck('pivot.sort')->implode(', ');
            }),
            'chapters' => $this->whenLoaded('chapters', function (){
                return ChapterResource::collection($this->chapters);
            }),
            'slug' => (string) $this->slug,
            'icon' => (string) $this->icon,
            'name' => (array) $this->name,
            'paid' => (boolean) $this->paid,
            'blocks' => $this->whenLoaded('blocks', function (){
                return BlockResource::collection($this->blocks);
            }),
            'is_read' => $this->isReadByUser(),
            'is_saved' => UserSave::isSaved(Article::class, (int) $this->id)
        ];
    }

    protected function isReadByUser() {
        if (!auth('sanctum')->check()) {
            return false;
        }
        return ArticleRead::where('user_id', auth('sanctum')->id())
            ->where('article_id', $this->id)
            ->exists();
    }

}
