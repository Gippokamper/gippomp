<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudyPlanResource extends JsonResource
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
            'with_content' => $this->whenLoaded('childPlan', function () {
                return $this->childPlan->isEmpty() ? true : false;
            }),
            'slug' => (string) $this->slug,
            'sort' => (string) $this->sort,
            'name' => (array) $this->name,
            'info' => (array) $this->info,
            'plan_ids' => $this->whenLoaded('parentPlan', function (){
                return StudyPlanResource::collection($this->parentPlan);
            }),
            'plan_sort' => $this->whenLoaded('parentPlan', function () {
                return $this->parentPlan->pluck('pivot.sort')->implode(', ');
            }),
            'child_plan' => $this->whenLoaded('childPlan', function (){
                return StudyPlanResource::collection($this->childPlan);
            }),
            'article_ids' => $this->whenLoaded('articles', function (){
                return ArticleResource::collection($this->articles);
            }),
            'article_sort' => $this->whenLoaded('articles', function () {
                return $this->articles->pluck('pivot.sort')->implode(', ');
            }),
            'blocks' => $this->whenLoaded('blocks', function (){
                return BlockResource::collection($this->blocks);
            })
        ];
    }

}
