<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'uuid' => (string) $this->uuid,
            'firstname' => (string) $this->firstname,
            'lastname' => (string) $this->lastname,
            'phone' => (int) $this->phone,
            'email' => (string) $this->email,
            'gender' => $this->gender,
            'profession' => $this->profession,
            'graduation_year' => (int) $this->graduation_year,
            'university_id' => $this->whenLoaded('university', function (){
                return $this->university->id;
            }),
            'wallet' => $this->whenLoaded('wallet', function (){
                return $this->wallet;
            }),
            'interests' => (string) $this->interests,
            'birthday' => (string) optional($this->birthday)->format('Y-m-d'),
            'region_id' => $this->whenLoaded('region', function (){
               return $this->region->id;
            }),
            'province' => (string) $this->province,
            'image' => (string) $this->image,
            'tariff' => TariffResource::collection($this->actualTariffs()),
            'role' => (string) $this->role,
            'status' => (int) $this->status,
            'created_at' => $this->created_at
        ];
    }

}
