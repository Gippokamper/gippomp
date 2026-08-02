<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnswerResource extends JsonResource
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
            'photos' => (array) $this->photos,
            'name' => (array) $this->name,
            'description' => (array) $this->description,
            'link' => (string) $this->link,
            'status' => (string) $this->status
        ];
    }

}
