<?php

namespace App\Http\Requests\StudyPlanRequests;

use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class StudyPlanRequest extends FormRequest
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
            'plan_ids' => ['nullable', 'exists:study_plans,id', 'array'],
            'plan_sort' => ['nullable', 'array'],

            'article_ids' => ['nullable', 'exists:articles,id', 'array'],
            'article_sort' => ['nullable', 'array'],

            'blocks' => ['array'],

            'slug' => ['nullable'],
            'sort' => ['required'],
            'name' => ['required', 'array'],
            'info' => ['required', 'array'],
            'plan_ids_with_sort' => ['nullable'],
            'article_ids_with_sort' => ['nullable'],
        ];
    }

    public function withValidator($validator)
    {
        $planIds = $this->get('plan_ids');
        $plan_sort = $this->get('plan_sort');

        $articleIds = $this->get('article_ids');
        $article_sort = $this->get('article_sort');

        if (!is_null($planIds) && !is_null($plan_sort)) {
            $validator->after(function ($validator) use ($planIds, $plan_sort){
                if (count($planIds) !== count($plan_sort)) {
                    $validator->errors()->add('plan_ids', 'The count of plan_ids and plan_sort must be the same.');
                }
            });
        }
        if (!is_null($articleIds) && !is_null($article_sort)) {
            $validator->after(function ($validator) use ($articleIds, $article_sort){
                if (count($articleIds) !== count($article_sort)) {
                    $validator->errors()->add('article_ids', 'The count of article_ids and article_sort must be the same.');
                }
            });
        }
    }

    protected function prepareForValidation()
    {
        $planIds = $this->get('plan_ids');
        $plan_sort = $this->get('plan_sort');
        $planIdsWithSort = [];
        if (!is_null($planIds) && !is_null($plan_sort)){
            foreach ($planIds as $index => $categoryId) {
                $planIdsWithSort[$categoryId] = ['sort' => $plan_sort[$index]];
            }
        }

        $articleIds = $this->get('article_ids');
        $article_sort = $this->get('article_sort');
        $articleIdsWithSort = [];
        if (!is_null($articleIds) && !is_null($article_sort)){
            foreach ($articleIds as $index => $articleId) {
                $articleIdsWithSort[$articleId] = ['sort' => $article_sort[$index]];
            }
        }
        $sort = 0;
        if (!is_null($this->get('sort'))){
            $sort = $this->get('sort')[0];
        }

        $this->merge([
            'sort' => $sort,
            'slug' => Str::slug($this->get('name')['uz']),
            'plan_ids_with_sort' => $planIdsWithSort,
            'article_ids_with_sort' => $articleIdsWithSort,
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

        $response = $this->errorResponse(400, __(ResponseError::ERROR_400->value),400, $errors->messages());

        throw new HttpResponseException($response);
    }
}
