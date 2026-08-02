<?php

namespace App\Http\Requests\QuizRequests;

use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class QuizRequest extends FormRequest
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
            'quiz_ids' => ['nullable', 'exists:quizzes,id', 'array'],
            'quiz_sort' => ['nullable', 'array'],

            'blocks' => ['array'],

            'slug' => ['nullable'],
            'sort' => ['required'],
            'name' => ['required', 'array'],
            'info' => ['required', 'array'],
            'quiz_ids_with_sort' => ['nullable'],
        ];
    }

    public function withValidator($validator)
    {
        $planIds = $this->get('quiz_ids');
        $quiz_sort = $this->get('quiz_sort');

        if (!is_null($planIds) && !is_null($quiz_sort)) {
            $validator->after(function ($validator) use ($planIds, $quiz_sort){
                if (count($planIds) !== count($quiz_sort)) {
                    $validator->errors()->add('quiz_ids', 'The count of quiz_ids and quiz_sort must be the same.');
                }
            });
        }
    }

    protected function prepareForValidation()
    {
        $quizIds = $this->get('quiz_ids');
        $quiz_sort = $this->get('quiz_sort');
        $quizIdsWithSort = [];
        if (!is_null($quizIds) && !is_null($quiz_sort)){
            foreach ($quizIds as $index => $quizId) {
                $quizIdsWithSort[$quizId] = ['sort' => $quiz_sort[$index]];
            }
        }

        $sort = 0;
        if (isset($this->get('sort')[0])){
            $sort = $this->get('sort')[0];
        }

        $this->merge([
            'sort' => $sort,
            'slug' => Str::slug($this->get('name')['uz']),
            'quiz_ids_with_sort' => $quizIdsWithSort,
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
