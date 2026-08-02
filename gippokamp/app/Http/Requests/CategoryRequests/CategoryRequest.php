<?php

namespace App\Http\Requests\CategoryRequests;

use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class CategoryRequest extends FormRequest
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
            'category_ids' => ['nullable', 'exists:categories,id', 'array'],
            'category_sort' => ['nullable', 'array'],
            'sort' => ['required', 'integer'],
            'icon' => ['nullable', 'string'],
            'slug' => ['nullable'],
            'name' => ['required', 'array'],
            'paid' => ['required', 'boolean'],
            'category_ids_with_sort' => ['nullable'],
        ];
    }

    public function withValidator($validator)
    {
        $categoryIds = $this->get('category_ids');
        $sort = $this->get('category_sort');
        if (!is_null($categoryIds) && !is_null($sort)) {
            $validator->after(function ($validator) {
                if (count($this->get('category_ids')) !== count($this->get('category_sort'))) {
                    $validator->errors()->add('category_ids', 'The count of category_ids and category_sort must be the same.');
                }
            });
        }
    }

    protected function prepareForValidation()
    {
        $categoryIds = $this->get('category_ids');
        $sort = $this->get('category_sort');
        $categoryIdsWithSort = [];
        if (!is_null($categoryIds) && !is_null($sort)){
            foreach ($categoryIds as $index => $categoryId) {
                $categoryIdsWithSort[$categoryId] = ['sort' => $sort[$index]];
            }
        }

        $sort = 0;
        if (!is_null($this->get('sort'))){
            $sort = $this->get('sort')[0] ?? 1;
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
            'boolean' => trans('validation.boolean', [], request()->lang),
            'string' => trans('validation.string', [], request()->lang),
            'exists' => trans('validation.exists', [], request()->lang),
            'integer' => trans('validation.integer', [], request()->lang),
        ];
    }
    public function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();

        $response = $this->errorResponse(400, __(ResponseError::ERROR_400->value), 400, $errors->messages());

        throw new HttpResponseException($response);
    }
}
