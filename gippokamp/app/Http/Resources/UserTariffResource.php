<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserTariffResource extends JsonResource
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
            'tariff' => TariffResource::make($this->whenLoaded('tariff')),
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'additional_info' => ($this->start_date <= now() && $this->end_date >= now()) ? true : false
        ];
    }

}
