<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TariffResource extends JsonResource
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
            'term_id' => $this->whenLoaded('term', function (){
                return TermResource::make($this->term);
            }),
            'photo' => (string) $this->photo,
            'name' => (array) $this->name,
            'advantages' => (array) $this->advantages,
            'price' => (float) $this->price
        ];
    }

}
