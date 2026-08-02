<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VocabularyResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        if (auth('sanctum')->check() && auth('sanctum')->user()->getRoleAttribute() == 'admin'){
            return [
                'id' => (integer) $this->id,
                'key' => (string) $this->key,
                'translation' => (array) $this->translation
            ];
        }else{
            return [
                $this->key => $this->translation[$request->lang ?? 'ru']
            ];
        }
    }

}
