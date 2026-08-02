<?php

namespace App\Http\Resources;

use App\Models\NewsSave;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
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
            'photo' => $this->photo,
            'title' => (array) $this->title,
            'description' => (array) $this->description,
            'date' => (string) $this->date,
            'actual' => (boolean) $this->actual,
            'is_saved' => $this->isSavedByUser()
        ];
    }

    protected function isSavedByUser() {
        if (!auth('sanctum')->check()) {
            return false;
        }
        return NewsSave::where('user_id', auth('sanctum')->id())
            ->where('news_id', $this->id)
            ->exists();
    }

}
