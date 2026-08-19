<?php

namespace App\Http\Requests\ChapterRequests;

use App\Enums\GenderType;
use App\Enums\ProfessionType;
use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class ChapterRequest extends FormRequest
{
    use ApiResponse;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'article_ids' => ['required', 'array', 'exists:articles,id'],
            'sort' => ['required', 'array'],
            'title' => ['required', 'array'],
            'description' => ['nullable', 'array'],
            'paid' => ['nullable', 'boolean'],
            'article_ids_with_sort' => ['nullable'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if (count($this->get('article_ids')) !== count($this->get('sort'))) {
                $validator->errors()->add('article_ids', 'The count of article_ids and sort must be the same.');
            }
        });
    }

    protected function prepareForValidation()
    {
        $articleIds = $this->get('article_ids');
        $sort = $this->get('sort');

        $articleIdsWithSort = [];
        foreach ($articleIds as $index => $articleId) {
            $articleIdsWithSort[$articleId] = ['sort' => $sort[$index]];
        }
        $this->merge([
            'article_ids_with_sort' => $articleIdsWithSort
        ]);
    }

    public function messages()
    {
        return [
            'required' => trans('validation.required', [], request()->lang),
            'array' => trans('validation.array', [], request()->lang),
        ];
    }
    public function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();

        $response = $this->errorResponse(400, __(ResponseError::ERROR_400->value),400, $errors->messages());

        throw new HttpResponseException($response);
    }
}
