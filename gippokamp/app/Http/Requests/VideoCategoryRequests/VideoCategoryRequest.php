<?php

namespace App\Http\Requests\VideoCategoryRequests;

use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Str;


class VideoCategoryRequest extends FormRequest
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
            'category_ids' => ['nullable', 'array', 'exists:video_categories,id'],
            'category_sort' => ['nullable', 'array'],
            'sort' => ['nullable'],
            'slug' => ['nullable', 'string'],
            'name' => ['required', 'array'],
            'category_ids_with_sort' => ['nullable'],
        ];
    }

    public function withValidator($validator)
    {
        $categoryIds = $this->get('category_ids');
        $category_sort = $this->get('category_sort');
        if (!is_null($categoryIds) && !is_null($category_sort)) {
            $validator->after(function ($validator) {
                if (count($this->get('category_ids')) !== count($this->get('category_sort'))) {
                    $validator->errors()->add('category_ids', 'The count of category_ids and category_sort must be the same.');
                }
            });
        }
    }

    protected function prepareForValidation()
    {
        $categoryIds = $this->get('category_ids', []);
        $category_sort = $this->get('category_sort', []);
        $sort = $this->get('sort', []);
        $categoryIdsWithSort = [];
        if (isset($categoryIds[0]) && isset($category_sort[0])){
            foreach ($categoryIds as $index => $categoryId) {
                $categoryIdsWithSort[$categoryId] = ['sort' => $category_sort[$index]];
            }
        }

        if (empty($sort)) {
            $sort = 0;
        } else {
            $sort = $sort[0];
        }

        $this->merge([
            'sort' => $sort,
            'slug' => Str::slug($this->get('name')['uz']),
            'category_ids_with_sort' => $categoryIdsWithSort
        ]);
    }

    public function messages()
    {
        return [
            'required' => trans('validation.required', [], request()->lang),
            'array' => trans('validation.array', [], request()->lang),
            'exists' => trans('validation.exists', [], request()->lang),
        ];
    }

    public function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();

        $response = $this->errorResponse(400, __(ResponseError::ERROR_400->value),400, $errors->messages());

        throw new HttpResponseException($response);
    }
}
