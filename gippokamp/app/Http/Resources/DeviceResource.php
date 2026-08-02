<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeviceResource extends JsonResource
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
            'notification_token' => (string) $this->notification_token,
            'name' => (string) $this->name,
            'view_name' => (string) $this->view_name,
            'type' => (string) $this->type,
            'created_at' => $this->created_at
        ];
    }

}
