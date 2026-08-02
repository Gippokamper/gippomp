<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FolderResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'type' => 'folders',
            'id' => (int) $this->id,
            'slug' => (string) $this->slug,
            'folder_ids' => $this->whenLoaded('parentFolder', function (){
                return FolderResource::collection($this->parentFolder);
            }),
            'sort' => $this->whenLoaded('parentFolder', function () {
                return $this->parentFolder->pluck('pivot.sort')->implode(', ');
            }),
            'child_folders' => $this->whenLoaded('childFolder', function (){
                return FolderResource::collection($this->childFolder);
            }),
            'questions' => $this->whenLoaded('questions', function (){
                return FolderResource::collection($this->questions);
            }),
            'questions_string' => $this->whenLoaded('questions', function (){
                return $this->questions->pluck('id')->join(',');
            }),
            'name' => (array) $this->name,
            'description' => (array) $this->description,
        ];
    }

}
