<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResumeResource extends JsonResource
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
            'vacancy' =>  $this->whenLoaded('vacancy', function (){
                return VacancyResource::make($this->vacancy);
            }),
            'full_name' => (string) $this->full_name,
            'birthday' => (string) $this->birthday,
            'address' => (string) $this->address,
            'email' => (string) $this->email,
            'phone' => (string) $this->phone,
            'now_do' => (string) $this->now_do,
            'study_info' => (string) $this->study_info,
            'english' => (boolean) $this->english,
            'german' => (boolean) $this->german,
            'language_level' => (string) $this->language_level,
            'stimulus' => (string) $this->stimulus,
            'interest' => (string) $this->interest,
            'comment' => (string) $this->comment,
        ];
    }

}
